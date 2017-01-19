'use strict';

const path = require('path');
const settings = require('../../lib/settings');
var mongo = require('../../lib/mongo');
var utils = require('../../lib/utils');
var parse = require('../../lib/parse');
var CategoriesService = require('./product_categories');
var ObjectID = require('mongodb').ObjectID;
var formidable = require('formidable');
var fs = require('fs-extra');
var _ = require('lodash');

class ProductsService {
  constructor() {}

  getProducts(params) {
    return Promise.all([
        mongo.db.collection('currencies').find().toArray(),
        CategoriesService.getCategories()
      ]).then(([ currencies, categories ]) => {
        const fieldsArray = this.getFieldsArray(params.fields);
        const limit = parse.getNumberIfPositive(params.limit) || 1000000;
        const offset = parse.getNumberIfPositive(params.offset) || 0;
        const projectQuery = this.getProjectQuery(fieldsArray, params.currency, currencies);
        const sortQuery = this.getSortQuery(params);
        const matchQuery = this.getMatchQuery(params, categories);
        const matchTextQuery = this.getMatchTextQuery(params);
        const aggregationPipeline = [];

        // $match with $text is only allowed as the first pipeline stage"
        if(matchTextQuery) {
          aggregationPipeline.push({ $match: matchTextQuery });
        }

        aggregationPipeline.push({$lookup: {
          from: "currencies",
          localField: "currency",
          foreignField: "currency",
          as: "currencies"
        }});

        aggregationPipeline.push({ $project: projectQuery });
        aggregationPipeline.push({ $match: matchQuery });
        aggregationPipeline.push({ $sort: sortQuery });
        aggregationPipeline.push({ $limit : limit });
        aggregationPipeline.push({ $skip : offset });

        return mongo.db.collection('products').aggregate(aggregationPipeline).toArray()
          .then(items => items.map(item => this.renameDocumentFields(categories, item, params.currency, currencies)))
      });
  }


  getSortQuery({ sort }) {
    if(sort === "search") {
      return { score: { $meta: "textScore" } }
    }
    else if(sort && sort.length > 0) {
      const fields = sort.split(',');
      return Object.assign(...fields.map(field => (
      	{[field.startsWith('-') ? field.slice(1) : field]: field.startsWith('-') ? -1 : 1}
      )))
    } else {
      return { position: 1, name: 1 }
    }
  }


  getProjectQuery(fieldsArray, toCurrency, currencies) {
    let salePrice = "$sale_price";
    let regularPrice = "$regular_price";
    let costPrice = "$cost_price";

    if(toCurrency && toCurrency.length === 3) {
      let toCurrencyObj = currencies.find(c => c.currency.toUpperCase() === toCurrency.toUpperCase());
      if(toCurrencyObj) {
        const toCurrencyRate = toCurrencyObj.rate;
        const fromCurrencyRateDefault = 1;
        salePrice = { $multiply: [ "$sale_price", { $divide: [ toCurrencyRate, { $ifNull: [{ $arrayElemAt: [ "$currencies.rate", 0 ] }, fromCurrencyRateDefault] } ] } ] };
        regularPrice = { $multiply: [ "$regular_price", { $divide: [ toCurrencyRate, { $ifNull: [{ $arrayElemAt: [ "$currencies.rate", 0 ] }, fromCurrencyRateDefault] } ] } ] };
        costPrice = { $multiply: [ "$cost_price", { $divide: [ toCurrencyRate, { $ifNull: [{ $arrayElemAt: [ "$currencies.rate", 0 ] }, fromCurrencyRateDefault] } ] } ] };
      }
    }

    let project =
    {
      brand_id: 1,
      related_product_ids: 1,
      active: 1,
      discontinued: 1,
      date_created: 1,
      date_updated: 1,
      cost_price: costPrice,
      regular_price: regularPrice,
      sale_price: salePrice,
      date_sale_from: 1,
      date_sale_to: 1,
      images: 1,
      prices: 1,
      quantity_inc: 1,
      quantity_min: 1,
      meta_description: 1,
      meta_title: 1,
      name: 1,
      description: 1,
      sku: 1,
      code: 1,
      position: 1,
      tags: 1,
      options: 1,
      variants: 1,
      weight: 1,
      dimensions: 1,
      attributes: 1,
      date_stock_expected: 1,
      stock_tracking: 1,
      stock_preorder: 1,
      stock_backorder: 1,
      stock_quantity: 1,
    	on_sale: {
    		$and: [
    			{
    				$lt: [new Date(), "$date_sale_to"]
    			}, {
    				$gt: [new Date(), "$date_sale_from"]
    			}
    		]
    	},
    	variable: {
    		$gt: [
    			{
    				$size: "$variants"
    			},
    			0
    		]
    	},
    	price: {
    		$cond: {
    			if: {
    				$and: [
    					{
    						$lt: [new Date(), "$date_sale_to"]
    					}, {
    						$gt: [new Date(), "$date_sale_from"]
    					}, {
    						$gt: ["$sale_price", 0]
    					}
    				]
    			},
    			then: salePrice,
    			else: regularPrice,
    	}
    	},
    	stock_status: {
    		$cond: {
    			if: {
    				$eq: ["$discontinued", true]
    			},
    			then: "discontinued",
    			else : {
    					$cond: {
    						if: {
    							$gt: ["$stock_quantity", 0]
    						},
    						then: "available",
    						else : {
    								$cond: {
    									if: {
    										$eq: ["$stock_backorder", true]
    									},
    									then: "backorder",
    									else : {
    											$cond: {
    												if: {
    													$eq: ["$stock_preorder", true]
    												},
    												then: "preorder",
    												else : "out_of_stock"
    										}
    										}
    									}
    							}
    						}
    				}
    			}
    	},
      url: { "$literal" : "" },
      path: { "$literal" : "" },
      category_name: { "$literal" : "" },
      brand_name: { "$literal" : "" }
    };

    if(fieldsArray && fieldsArray.length > 0) {
      project = this.getProjectFilteredByFields(project, fieldsArray);
    }

    // required fields
    project._id = 0;
    project.id = "$_id";
    project.category_id = 1;
    project.currency = 1;
    project.slug = 1;

    return project;
  }

  getFieldsArray(fields) {
    return (fields && fields.length > 0) ? fields.split(',') : [];
  }

  getProjectFilteredByFields(project, fieldsArray) {
    return Object.assign(...fieldsArray.map(key => ({[key]: project[key]}) ));
  }

  getMatchTextQuery({search }) {
    return (search && search.length > 0) ? { $text: { $search: search } } : null;
  }

  getMatchQuery({
    brand_id,
    category_id,
    active,
    discontinued,
    on_sale,
    stock_status,
    price_from,
    price_to,
    sku,
    ids
  }, categories) {

     // parse values
     brand_id = parse.getObjectIDIfValid(brand_id);
     category_id = parse.getObjectIDIfValid(category_id);
     active = parse.getBooleanIfValid(active);
     discontinued = parse.getBooleanIfValid(discontinued);
     on_sale = parse.getBooleanIfValid(on_sale);
     price_from = parse.getNumberIfPositive(price_from);
     price_to = parse.getNumberIfPositive(price_to);

     let queries = [];
     const currentDate = new Date();

     if(category_id !== null) {
       var categoryChildren = [];
       CategoriesService.findAllChildren(categories, category_id, categoryChildren);
       queries.push({
         category_id: { $in: categoryChildren }
       });
     }

     if(brand_id !== null) {
       queries.push({
         brand_id: brand_id
       });
     }

     if(active !== null) {
       queries.push({
         active: active
       });
     }

     if(discontinued !== null) {
       queries.push({
         discontinued: discontinued
       });
     }

     if(on_sale !== null) {
       queries.push({
         on_sale: true
       });
     }

     if(price_from !== null) {
       queries.push({
         price: { $gte: price_from }
       });
     }

     if(price_to !== null) {
       queries.push({
         price: { $lte: price_to }
       });
     }

     if(stock_status && stock_status.length > 0) {
       queries.push({
         stock_status: stock_status
       });
     }

     if(ids && ids.length > 0) {
       const idsArray = ids.split(',');
       let objectIDs = [];
       for(const id of idsArray) {
         if(ObjectID.isValid(id)) {
           objectIDs.push(new ObjectID(id));
         }
       }
       queries.push({
         id: { $in: objectIDs }
       });
     }

     if(sku && sku.length > 0) {
       queries.push({
         sku: sku
       });
     }

     let query = {};
     if(queries.length === 1) {
       query = queries[0];
     } else if(queries.length > 1) {
       query = {
        $and: queries
       }
     }

     return query;
  }

  getSingleProduct(id, currency) {
    if(!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    return this.getProducts({ ids: id, limit: 1, currency: currency})
    .then(items => items.length > 0 ? items[0] : {})
  }

  addProduct(data) {
    return this.getDocumentForInsert(data)
    .then(dataToInsert => {
      // is SKU unique
      if(dataToInsert.sku && dataToInsert.sku.length > 0) {
        return mongo.db.collection('products').count({ sku: dataToInsert.sku }).then(count => count === 0 ? dataToInsert : Promise.reject('Product SKU must be unique'));
      } else {
        return dataToInsert;
      }
    })
    .then(dataToInsert => mongo.db.collection('products').insertMany([dataToInsert]))
    .then(res => this.getSingleProduct(res.ops[0]._id.toString()))
  }

  updateProduct(id, data) {
    if(!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const productObjectID = new ObjectID(id);

    return this.getDocumentForUpdate(id, data)
    .then(dataToSet => {
      // is SKU unique
      if(dataToSet.sku && dataToSet.sku.length > 0) {
        return mongo.db.collection('products').count({ _id: { $ne: productObjectID }, sku: dataToSet.sku }).then(count => count === 0 ? dataToSet : Promise.reject('Product SKU must be unique'));
      } else {
        return dataToSet;
      }
    })
    .then(dataToSet => mongo.db.collection('products').updateOne({ _id: productObjectID }, {$set: dataToSet}))
    .then(res => this.getSingleProduct(id))
  }

  deleteProduct(productId) {
    if(!ObjectID.isValid(productId)) {
      return Promise.reject('Invalid identifier');
    }
    const productObjectID = new ObjectID(productId);
    // 1. delete Product
    return mongo.db.collection('products').deleteOne({'_id': productObjectID})
    .then(res => {
      // 2. delete directory with images
      let deleteDir = settings.path.uploads.products + '/' + productId;
      fs.remove(deleteDir, err => {});
      return true;
    });
  }

  getErrorMessage(err) {
    return { 'error': true, 'message': err.toString() };
  }

  getDocumentForInsert(data) {
      //  Allow empty product to create draft

      let product = {
        'date_created': new Date(),
        'date_updated': null,
        'images': [],
        'dimensions': {
            'length': 0,
            'width': 0,
            'height': 0
        }
      };

      product.name = parse.getString(data.name);
      product.description = parse.getString(data.description);
      product.meta_description = parse.getString(data.meta_description);
      product.meta_title = parse.getString(data.meta_title);
      product.tags = parse.getArrayIfValid(data.tags) || [];
      product.attributes = parse.getArrayIfValid(data.attributes) || [];
      product.active = parse.getBooleanIfValid(data.active, true);
      product.discontinued = parse.getBooleanIfValid(data.discontinued, false);
      product.currency = parse.getCurrencyIfValid(data.currency) || "USD";
      product.sku = parse.getString(data.sku);
      product.code = parse.getString(data.code);
      product.related_product_ids = parse.getArrayIfValid(data.related_product_ids) || [];
      product.prices = parse.getArrayIfValid(data.prices) || [];
      product.options = parse.getArrayIfValid(data) || [];
      product.variants = parse.getArrayIfValid(data.variants) || [];
      product.cost_price = parse.getNumberIfPositive(data.cost_price) || 0;
      product.regular_price = parse.getNumberIfPositive(data.regular_price) || 0;
      product.sale_price = parse.getNumberIfPositive(data.sale_price) || 0;
      product.quantity_inc = parse.getNumberIfPositive(data.quantity_inc) || 1;
      product.quantity_min = parse.getNumberIfPositive(data.quantity_min) || 1;
      product.weight = parse.getNumberIfPositive(data.weight) || 0;
      product.stock_quantity = parse.getNumberIfPositive(data.stock_quantity) || 0;
      product.position = parse.getNumberIfValid(data.position);
      product.date_stock_expected = parse.getDateIfValid(data.date_stock_expected);
      product.date_sale_from = parse.getDateIfValid(data.date_sale_from);
      product.date_sale_to = parse.getDateIfValid(data.date_sale_to);
      product.stock_tracking = parse.getBooleanIfValid(data.stock_tracking, false);
      product.stock_preorder = parse.getBooleanIfValid(data.stock_preorder, false);
      product.stock_backorder = parse.getBooleanIfValid(data.stock_backorder, false);
      product.brand_id = parse.getObjectIDIfValid(data.brand_id);
      product.category_id = parse.getObjectIDIfValid(data.category_id);

      if(data.dimensions) {
        product.dimensions = data.dimensions;
      }

      let slug = (!data.slug || data.slug.length === 0) ? data.name : data.slug;
      if(!slug || slug.length === 0) {
        return Promise.resolve(product);
      } else {
        return utils.getAvailableSlug(slug).then(newSlug => {
          product.slug = newSlug;
          return product;
        });
      }
  }

  getDocumentForUpdate(id, data) {
    return new Promise((resolve, reject) => {
      if(_.isEmpty(data)) {
        reject('Required fields are missing');
      }

      let product = {
        'date_updated': new Date()
      };

      if(!_.isUndefined(data.name)) {
        product.name = parse.getString(data.name);
      }

      if(!_.isUndefined(data.description)) {
        product.description = parse.getString(data.description);
      }

      if(!_.isUndefined(data.meta_description)) {
        product.meta_description = parse.getString(data.meta_description);
      }

      if(!_.isUndefined(data.meta_title)) {
        product.meta_title = parse.getString(data.meta_title);
      }

      if(!_.isUndefined(data.tags)) {
        product.tags = parse.getArrayIfValid(data.tags) || [];
      }

      if(!_.isUndefined(data.attributes)) {
        product.attributes = parse.getArrayIfValid(data.attributes) || [];
      }

      if(!_.isUndefined(data.dimensions)) {
        product.dimensions = data.dimensions;
      }

      if(!_.isUndefined(data.active)) {
        product.active = parse.getBooleanIfValid(data.active, true);
      }

      if(!_.isUndefined(data.discontinued)) {
        product.discontinued = parse.getBooleanIfValid(data.discontinued, false);
      }

      if(!_.isUndefined(data.currency)) {
        product.currency = parse.getCurrencyIfValid(data.currency) || "USD";
      }

      if(!_.isUndefined(data.sku)) {
        product.sku = parse.getString(data.sku);
      }

      if(!_.isUndefined(data.code)) {
        product.code = parse.getString(data.code);
      }

      if(!_.isUndefined(data.related_product_ids)) {
        product.related_product_ids = parse.getArrayIfValid(data.related_product_ids) || [];
      }

      if(!_.isUndefined(data.images)) {
        product.images = parse.getArrayIfValid(data.images) || [];
      }

      if(!_.isUndefined(data.prices)) {
        product.prices = parse.getArrayIfValid(data.prices) || [];
      }

      if(!_.isUndefined(data.options)) {
        product.options = parse.getArrayIfValid(data.options) || [];
      }

      if(!_.isUndefined(data.variants)) {
        product.variants = parse.getArrayIfValid(data.variants) || [];
      }

      if(!_.isUndefined(data.cost_price)) {
        product.cost_price = parse.getNumberIfPositive(data.cost_price) || 0;
      }

      if(!_.isUndefined(data.regular_price)) {
        product.regular_price = parse.getNumberIfPositive(data.regular_price) || 0;
      }

      if(!_.isUndefined(data.sale_price)) {
        product.sale_price = parse.getNumberIfPositive(data.sale_price) || 0;
      }

      if(!_.isUndefined(data.quantity_inc)) {
        product.quantity_inc = parse.getNumberIfPositive(data.quantity_inc) || 1;
      }

      if(!_.isUndefined(data.quantity_min)) {
        product.quantity_min = parse.getNumberIfPositive(data.quantity_min) || 1;
      }

      if(!_.isUndefined(data.weight)) {
        product.weight = parse.getNumberIfPositive(data.weight) || 0;
      }

      if(!_.isUndefined(data.stock_quantity)) {
        product.stock_quantity = parse.getNumberIfPositive(data.stock_quantity) || 0;
      }

      if(!_.isUndefined(data.position)) {
        product.position = parse.getNumberIfValid(data.position);
      }

      if(!_.isUndefined(data.date_stock_expected)) {
        product.date_stock_expected = parse.getDateIfValid(data.date_stock_expected);
      }

      if(!_.isUndefined(data.date_sale_from)) {
        product.date_sale_from = parse.getDateIfValid(data.date_sale_from);
      }

      if(!_.isUndefined(data.date_sale_to)) {
        product.date_sale_to = parse.getDateIfValid(data.date_sale_to);
      }

      if(!_.isUndefined(data.stock_tracking)) {
        product.stock_tracking = parse.getBooleanIfValid(data.stock_tracking, false);
      }

      if(!_.isUndefined(data.stock_preorder)) {
        product.stock_preorder = parse.getBooleanIfValid(data.stock_preorder, false);
      }

      if(!_.isUndefined(data.stock_backorder)) {
        product.stock_backorder = parse.getBooleanIfValid(data.stock_backorder, false);
      }

      if(!_.isUndefined(data.brand_id)) {
        product.brand_id = parse.getObjectIDIfValid(data.brand_id);
      }

      if(!_.isUndefined(data.category_id)) {
        product.category_id = parse.getObjectIDIfValid(data.category_id);
      }

      if(!_.isUndefined(data.slug)){
        let slug = data.slug;
        if(!slug || slug.length === 0) {
          slug = data.name;
        }

        utils.getAvailableSlug(slug, id)
        .then(newSlug => {
          product.slug = newSlug;
          resolve(product);
        })
        .catch(err => {
          reject(err);
        });

      } else {
        resolve(product);
      }
    });
  }

  renameDocumentFields(categories, item, toCurrency, currencies) {
    if(item) {

      // convert currency for Variants and Prices
      if(toCurrency && toCurrency.length === 3) {
        let toCurrencyObj = currencies.find(c => c.currency.toUpperCase() === toCurrency.toUpperCase());
        let fromCurrencyObj = currencies.find(c => c.currency.toUpperCase() === item.currency.toUpperCase());
        if(toCurrencyObj && fromCurrencyObj) {
          const toCurrencyRate = toCurrencyObj.rate;
          const fromCurrencyRate = fromCurrencyObj.rate;
          const rate = toCurrencyRate / fromCurrencyRate;

          if(item.prices && item.prices.length > 0) {
            item.prices = item.variants.map(e => {
              if(e.price > 0) {
                e.price = e.price * rate;
              }
              return e;
            });
          }

          if(item.variants && item.variants.length > 0) {
            item.variants = item.variants.map(e => {
              if(e.price > 0) {
                e.price = e.price * rate;
              }
              return e;
            });
          }

          item.currency = toCurrency.toUpperCase();
        }
      }

      if(item.id) {
        item.id = item.id.toString();
      }

      if(item.brand_id) {
        item.brand_id = item.brand_id.toString();
      }

      if(item.images && item.images.length > 0) {
        for(let i = 0; i < item.images.length; i++) {
          item.images[i].url = settings.url.uploads.products + '/' + item.id + '/' + item.images[i].filename;
        }
        item.images = item.images.sort((a,b) => (a.position - b.position ));
      }

      if(item.category_id) {
        item.category_id = item.category_id.toString();

        if(categories && categories.length > 0) {
          const category = categories.find(i => i.id === item.category_id);
          if(category) {
            if(item.category_name === "") {
              item.category_name = category.name;
            }

            if(item.url === "") {
              item.url = path.join(settings.storeBaseUrl, category.slug || '', item.slug || '');
            }

            if(item.path === "") {
              item.path = path.join('/', category.slug || '', item.slug || '');
            }
          }
        }
      }
    }

    return item;
  }

  deleteProductImage(productId, imageId) {
    if(!ObjectID.isValid(productId) || !ObjectID.isValid(imageId)) {
      return Promise.reject('Invalid identifier');
    }
    let productObjectID = new ObjectID(productId);
    let imageObjectID = new ObjectID(imageId);

    return this.getSingleProduct(productId)
    .then(item => {
      if(item.images && item.images.length > 0) {
        let imageData = item.images.find(i => i.id.toString() === imageId.toString());
        if(imageData) {
          let filename = imageData.filename;
          let filepath = settings.path.uploads.products + '/' + productId + '/' + filename;
          fs.removeSync(filepath);
          return mongo.db.collection('products').updateOne({ _id: productObjectID }, { $pull: { images: { id: imageId } } })
        } else {
          return true;
        }
      } else {
        return true;
      }
    })
    .then(() => true);
  }

  addProductImage(req, res) {
    let productId = req.params.id;
    if(!ObjectID.isValid(productId)) {
      return Promise.reject('Invalid identifier');
    }
    let productObjectID = new ObjectID(productId);
    let uploadedFiles = [];
    let uploadDir = settings.path.uploads.products + '/' + productId;
    fs.ensureDirSync(uploadDir);

    let form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;

    form
      .on('fileBegin', (name, file) => {
        // Emitted whenever a field / value pair has been received.
        file.path = uploadDir + '/' + file.name;
      })
      .on('file', function(field, file) {
        // every time a file has been uploaded successfully,
        if(file.name) {
          var imageData = {
            "id": new ObjectID(),
            "alt": "",
            "position": 99,
            "filename": file.name
          };

          mongo.db.collection('products')
            .updateOne({ _id: productObjectID }, { $push: { images: imageData } })
            .then();
          uploadedFiles.push({ 'file': file.name, 'size': file.size });
        }
      })
      .on('error', (err) => {
        res.status(500).send(this.getErrorMessage(err));
      })
      .on('end', () => {
        res.send(uploadedFiles);
      });

    form.parse(req);
  }

}

module.exports = new ProductsService();
