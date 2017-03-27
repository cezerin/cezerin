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

class ProductsService {
  constructor() {}

  getProducts(params = {}) {
    return Promise.all([
        CategoriesService.getCategories()
      ]).then(([ categories ]) => {
        const fieldsArray = this.getFieldsArray(params.fields);
        const limit = parse.getNumberIfPositive(params.limit) || 1000000;
        const offset = parse.getNumberIfPositive(params.offset) || 0;
        const projectQuery = this.getProjectQuery(fieldsArray);
        const sortQuery = this.getSortQuery(params);
        const matchQuery = this.getMatchQuery(params, categories);
        const matchTextQuery = this.getMatchTextQuery(params);
        const thumbnail_width = parse.getNumberIfPositive(params.thumbnail_width);
        const aggregationPipeline = [];

        // $match with $text is only allowed as the first pipeline stage"
        if(matchTextQuery) {
          aggregationPipeline.push({ $match: matchTextQuery });
        }

        aggregationPipeline.push({ $project: projectQuery });
        aggregationPipeline.push({ $match: matchQuery });
        aggregationPipeline.push({ $sort: sortQuery });
        aggregationPipeline.push({ $skip : offset });
        aggregationPipeline.push({ $limit : limit });

        return mongo.db.collection('products').aggregate(aggregationPipeline).toArray()
          .then(items => items.map(item => this.changeProperties(categories, item, thumbnail_width)))
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


  getProjectQuery(fieldsArray) {
    let salePrice = "$sale_price";
    let regularPrice = "$regular_price";
    let costPrice = "$cost_price";

    let project =
    {
      related_product_ids: 1,
      enabled: 1,
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
      tax_class: 1,
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
      category_name: { "$literal" : "" }
    };

    if(fieldsArray && fieldsArray.length > 0) {
      project = this.getProjectFilteredByFields(project, fieldsArray);
    }

    // required fields
    project._id = 0;
    project.id = "$_id";
    project.category_id = 1;
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
    return (search && search.length > 0 && search !== 'null' && search !== 'undefined') ? { $text: { $search: search } } : null;
  }

  getMatchQuery({
    category_id,
    enabled,
    discontinued,
    on_sale,
    stock_status,
    price_from,
    price_to,
    sku,
    ids
  }, categories) {

     // parse values
     category_id = parse.getObjectIDIfValid(category_id);
     enabled = parse.getBooleanIfValid(enabled);
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

     if(enabled !== null) {
       queries.push({
         enabled: enabled
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

     if(price_from !== null && price_from > 0) {
       queries.push({
         price: { $gte: price_from }
       });
     }

     if(price_to !== null && price_to > 0) {
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

  getSingleProduct(id) {
    if(!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    return this.getProducts({ ids: id, limit: 1})
    .then(items => items.length > 0 ? items[0] : {})
  }

  addProduct(data) {
    return this.getValidDocumentForInsert(data)
    .then(dataToInsert => mongo.db.collection('products').insertMany([dataToInsert]))
    .then(res => this.getSingleProduct(res.ops[0]._id.toString()))
  }

  updateProduct(id, data) {
    if(!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const productObjectID = new ObjectID(id);

    return this.getValidDocumentForUpdate(id, data)
    .then(dataToSet => mongo.db.collection('products').updateOne({ _id: productObjectID }, {$set: dataToSet}))
    .then(res => res.modifiedCount > 0 ? this.getSingleProduct(id) : null)
  }

  deleteProduct(productId) {
    if(!ObjectID.isValid(productId)) {
      return Promise.reject('Invalid identifier');
    }
    const productObjectID = new ObjectID(productId);
    // 1. delete Product
    return mongo.db.collection('products').deleteOne({'_id': productObjectID})
    .then(deleteResponse => {
      if(deleteResponse.deletedCount > 0) {
        // 2. delete directory with images
        let deleteDir = settings.path.products + '/' + productId;
        fs.remove(deleteDir, err => {});
      }
      return deleteResponse.deletedCount > 0;
    });
  }

  getErrorMessage(err) {
    return { 'error': true, 'message': err.toString() };
  }

  getValidDocumentForInsert(data) {
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
    product.enabled = parse.getBooleanIfValid(data.enabled, true);
    product.discontinued = parse.getBooleanIfValid(data.discontinued, false);
    product.slug = parse.getString(data.slug);
    product.sku = parse.getString(data.sku);
    product.code = parse.getString(data.code);
    product.tax_class = parse.getString(data.tax_class);
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
    product.category_id = parse.getObjectIDIfValid(data.category_id);

    if(data.dimensions) {
      product.dimensions = data.dimensions;
    }

    if(product.slug.length === 0) {
      product.slug = product.name;
    }

    return this.setAvailableSlug(product).then(product => this.setAvailableSku(product));
  }

  getValidDocumentForUpdate(id, data) {
    if (Object.keys(data).length === 0) {
      throw new Error('Required fields are missing');
    }

    let product = {
      'date_updated': new Date()
    }

    if(data.name !== undefined) {
      product.name = parse.getString(data.name);
    }

    if(data.description !== undefined) {
      product.description = parse.getString(data.description);
    }

    if(data.meta_description !== undefined) {
      product.meta_description = parse.getString(data.meta_description);
    }

    if(data.meta_title !== undefined) {
      product.meta_title = parse.getString(data.meta_title);
    }

    if(data.tags !== undefined) {
      product.tags = parse.getArrayIfValid(data.tags) || [];
    }

    if(data.attributes !== undefined) {
      product.attributes = parse.getArrayIfValid(data.attributes) || [];
    }

    if(data.dimensions !== undefined) {
      product.dimensions = data.dimensions;
    }

    if(data.enabled !== undefined) {
      product.enabled = parse.getBooleanIfValid(data.enabled, true);
    }

    if(data.discontinued !== undefined) {
      product.discontinued = parse.getBooleanIfValid(data.discontinued, false);
    }

    if(data.slug !== undefined) {
      product.slug = parse.getString(data.slug);
    }

    if(data.sku !== undefined) {
      product.sku = parse.getString(data.sku);
    }

    if(data.code !== undefined) {
      product.code = parse.getString(data.code);
    }

    if(data.tax_class !== undefined) {
      product.tax_class = parse.getString(data.tax_class);
    }

    if(data.related_product_ids !== undefined) {
      product.related_product_ids = parse.getArrayIfValid(data.related_product_ids) || [];
    }

    // if(data.images !== undefined) {
    //   product.images = parse.getArrayIfValid(data.images) || [];
    // }

    if(data.prices !== undefined) {
      product.prices = parse.getArrayIfValid(data.prices) || [];
    }

    if(data.options !== undefined) {
      product.options = parse.getArrayIfValid(data.options) || [];
    }

    if(data.variants !== undefined) {
      product.variants = parse.getArrayIfValid(data.variants) || [];
    }

    if(data.cost_price !== undefined) {
      product.cost_price = parse.getNumberIfPositive(data.cost_price) || 0;
    }

    if(data.regular_price !== undefined) {
      product.regular_price = parse.getNumberIfPositive(data.regular_price) || 0;
    }

    if(data.sale_price !== undefined) {
      product.sale_price = parse.getNumberIfPositive(data.sale_price) || 0;
    }

    if(data.quantity_inc !== undefined) {
      product.quantity_inc = parse.getNumberIfPositive(data.quantity_inc) || 1;
    }

    if(data.quantity_min !== undefined) {
      product.quantity_min = parse.getNumberIfPositive(data.quantity_min) || 1;
    }

    if(data.weight !== undefined) {
      product.weight = parse.getNumberIfPositive(data.weight) || 0;
    }

    if(data.stock_quantity !== undefined) {
      product.stock_quantity = parse.getNumberIfPositive(data.stock_quantity) || 0;
    }

    if(data.position !== undefined) {
      product.position = parse.getNumberIfValid(data.position);
    }

    if(data.date_stock_expected !== undefined) {
      product.date_stock_expected = parse.getDateIfValid(data.date_stock_expected);
    }

    if(data.date_sale_from !== undefined) {
      product.date_sale_from = parse.getDateIfValid(data.date_sale_from);
    }

    if(data.date_sale_to !== undefined) {
      product.date_sale_to = parse.getDateIfValid(data.date_sale_to);
    }

    if(data.stock_tracking !== undefined) {
      product.stock_tracking = parse.getBooleanIfValid(data.stock_tracking, false);
    }

    if(data.stock_preorder !== undefined) {
      product.stock_preorder = parse.getBooleanIfValid(data.stock_preorder, false);
    }

    if(data.stock_backorder !== undefined) {
      product.stock_backorder = parse.getBooleanIfValid(data.stock_backorder, false);
    }

    if(data.category_id !== undefined) {
      product.category_id = parse.getObjectIDIfValid(data.category_id);
    }

    return this.setAvailableSlug(product, id).then(product => this.setAvailableSku(product, id));
  }

  changeProperties(categories, item, thumbnail_width) {
    if(item) {

      if(item.id) {
        item.id = item.id.toString();
      }

      if(item.images && item.images.length > 0) {
        for(let i = 0; i < item.images.length; i++) {
          const thumbnailWidthDirOrEmpty = thumbnail_width && thumbnail_width > 0 ? `${thumbnail_width}/` : '';
          const imageFileName = item.images[i].filename || '';
          item.images[i].url = `${settings.url.products}/${item.id}/${thumbnailWidthDirOrEmpty}${imageFileName}`;
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
          let filepath = settings.path.products + '/' + productId + '/' + filename;
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
    let uploadDir = settings.path.products + '/' + productId;
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

  isSkuExists(sku, productId) {
    let filter = {
      sku: sku
    }

    if(productId && ObjectID.isValid(productId)) {
      filter._id = { $ne: new ObjectID(productId) }
    }

    return mongo.db.collection('products').count(filter).then(count => count > 0);
  }

  setAvailableSku(product, productId) {
    // SKU can be empty
    if(product.sku && product.sku.length > 0) {
      let newSku = product.sku;
      let filter = {};
      if(productId && ObjectID.isValid(productId)) {
        filter._id = { $ne: new ObjectID(productId) }
      }

      return mongo.db.collection('products').find(filter).project({sku: 1}).toArray()
        .then(products => {
          while(products.find(p => p.sku === newSku)) {
            newSku += '-2';
          }
          product.sku = newSku;
          return product;
        })
    } else {
      return Promise.resolve(product)
    }
  }

  isSlugExists(slug, productId) {
    let filter = {
      slug: utils.cleanSlug(slug)
    }

    if(productId && ObjectID.isValid(productId)) {
      filter._id = { $ne: new ObjectID(productId) }
    }

    return mongo.db.collection('products').count(filter).then(count => count > 0);
  }

  setAvailableSlug(product, productId) {
    let newSlug = utils.cleanSlug(product.slug);

    if(newSlug.length > 0) {
      let filter = {};
      if(productId && ObjectID.isValid(productId)) {
        filter._id = { $ne: new ObjectID(productId) }
      }

      return mongo.db.collection('products').find(filter).project({slug: 1}).toArray()
        .then(products => {
          while(products.find(p => p.slug === newSlug)) {
            newSlug += '-2';
          }
          product.slug = newSlug;
          return product;
        })
    } else {
      product.slug = '';
      return Promise.resolve(product)
    }
  }

}

module.exports = new ProductsService();
