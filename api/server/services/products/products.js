'use strict';

const path = require('path');
const settings = require('../../lib/settings');
var mongo = require('../../lib/mongo');
var utils = require('../../lib/utils');
var parse = require('../../lib/parse');
var ObjectID = require('mongodb').ObjectID;
var formidable = require('formidable');
var fs = require('fs-extra');
var _ = require('lodash');

/* TODO
  validate add/update data types
  validate add/update data values
  implement Get with filters
*/
class ProductsService {
  constructor() {}

  getProducts(language) {
    return new Promise((resolve, reject) => {
      mongo.db.collection('products')
        .find()
        .toArray()
        .then(items => {
          for(let key in items) {
            items[key] = this.renameDocumentFields(language, items[key]);
          }
          resolve(items);
        })
        .catch(err => { reject(this.getErrorMessage(err)) });
      });

  }

  getSingleProduct(language, id) {
    return new Promise((resolve, reject) => {
      let productObjectID = this.parseObjectID(id);
      mongo.db.collection('products')
        .findOne({ _id: productObjectID })
        .then(item => {
          item = this.renameDocumentFields(language, item);
          resolve(item);
        })
        .catch(err => { reject(this.getErrorMessage(err)) });
      });
  }

  addProduct(language, data) {
    return new Promise((resolve, reject) => {
      this.getDocumentForInsert(language, data)
      .then(dataToInsert => {
        mongo.db.collection('products')
          .insertMany([dataToInsert])
          .then(res => {
            let insertedItem = res.ops[0];
            insertedItem = this.renameDocumentFields(language, insertedItem);
            resolve(insertedItem);
          })
          .catch(err => { reject(this.getErrorMessage(err)) });
      });
    });
  }

  updateProduct(language, id, data) {
    return new Promise((resolve, reject) => {
      let productObjectID = this.parseObjectID(id);
      this.getDocumentForUpdate(id, language, data)
      .then(dataToSet => {
        mongo.db.collection('products')
          .findOneAndUpdate({ _id: productObjectID }, {$set: dataToSet}, { returnOriginal: false })
          .then(res => {
            if(res.value) {
              let updatedItem = res.value;
              updatedItem = this.renameDocumentFields(language, updatedItem);
              resolve(updatedItem);
            } else {
              resolve();
            }
           })
      })
      .catch(err => { reject(this.getErrorMessage(err)) });;
    });
  }

  deleteProduct(productId) {
    let productObjectID = this.parseObjectID(productId);
    // 1. delete Product
    return mongo.db.collection('products')
      .deleteOne({'_id': productObjectID})
      .then(res => {
        // 2. delete directory with images
        let deleteDir = settings.path.uploads.products + '/' + productId;
        fs.remove(deleteDir, err => {});
        return true;
      });
  }

  parseObjectID(id) {
    try {
      return new ObjectID(id);
    } catch (e) {
      throw this.getErrorMessage('Invalid identifier')
      return;
    }
  }

  getErrorMessage(err) {
    return { 'error': true, 'message': err.toString() };
  }

  getDocumentForInsert(language, data, newPosition) {
      //  Allow empty product to create draft

      let product = {
        'date_created': new Date(),
        'date_updated': null,
        'meta_description': {},
        'meta_title': {},
        'name': {},
        'description': {},
        'tags': {},
        'dimensions': {
            'length': 0,
            'width': 0,
            'height': 0
        }
      };

      product.name[language] = parse.getString(data.name) || '';
      product.description[language] = parse.getString(data.description) || '';
      product.meta_description[language] = parse.getString(data.meta_description) || '';
      product.meta_title[language] = parse.getString(data.meta_title) || '';
      product.active = parse.getBooleanIfValid(data.active) || true;
      product.discontinued = parse.getBooleanIfValid(data.discontinued) || false;
      product.currency = parse.getCurrencyIfValid(data.currency);
      product.sku = parse.getString(data.sku);
      product.code = parse.getString(data.code);
      product.tags[language] = parse.getArrayIfValid(data.tags) || [];
      product.related_product_ids = parse.getArrayIfValid(data.related_product_ids) || [];
      product.images = parse.getArrayIfValid(data.images) || [];
      product.prices = parse.getArrayIfValid(data.prices) || [];
      product.options = parse.getArrayIfValid(data.options) || [];
      product.variants = parse.getArrayIfValid(data.variants) || [];
      product.attributes = parse.getArrayIfValid(data.attributes) || [];
      product.cost_price = parse.getNumberIfPositive(data.cost_price);
      product.regular_price = parse.getNumberIfPositive(data.regular_price);
      product.sale_price = parse.getNumberIfPositive(data.sale_price);
      product.quantity_inc = parse.getNumberIfPositive(data.quantity_inc) || 1;
      product.quantity_min = parse.getNumberIfPositive(data.quantity_min) || 1;
      product.weight = parse.getNumberIfPositive(data.weight) || 0;
      product.stock_quantity = parse.getNumberIfPositive(data.stock_quantity) || 0;
      product.position = parse.getNumberIfValid(data.position);
      product.date_stock_expected = parse.getDateIfValid(data.date_stock_expected);
      product.date_sale_from = parse.getDateIfValid(data.date_sale_from);
      product.date_sale_to = parse.getDateIfValid(data.date_sale_to);
      product.stock_tracking = parse.getBooleanIfValid(data.stock_tracking) || false;
      product.stock_preorder = parse.getBooleanIfValid(data.stock_preorder) || false;
      product.stock_backorder = parse.getBooleanIfValid(data.stock_backorder) || false;
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

  getDocumentForUpdate(id, language, data) {
    return new Promise((resolve, reject) => {
      if(_.isEmpty(data)) {
        reject('Required fields are missing');
      }

      let product = {
        'date_updated': new Date()
      };

      if(language) {
        if(!_.isUndefined(data.name)) {
          product['name.' + language] = parse.getString(data.name) || '';
        }

        if(!_.isUndefined(data.description)) {
          product['description.' + language] = parse.getString(data.description) || '';
        }

        if(!_.isUndefined(data.meta_description)) {
          product['meta_description.' + language] = parse.getString(data.meta_description) || '';
        }

        if(!_.isUndefined(data.meta_title)) {
          product['meta_title.' + language] = parse.getString(data.meta_title) || '';
        }

        if(!_.isUndefined(data.tags)) {
          product['tags.' + language] = parse.getArrayIfValid(data.tags) || [];
        }
      }

      if(!_.isUndefined(data.dimensions)) {
        product.dimensions = data.dimensions;
      }

      if(!_.isUndefined(data.active)) {
        product.active = parse.getBooleanIfValid(data.active) || true;
      }

      if(!_.isUndefined(data.discontinued)) {
        product.discontinued = parse.getBooleanIfValid(data.discontinued) || false;
      }

      if(!_.isUndefined(data.currency)) {
        product.currency = parse.getCurrencyIfValid(data.currency);
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

      if(!_.isUndefined(data.attributes)) {
        product.attributes = parse.getArrayIfValid(data.attributes) || [];
      }

      if(!_.isUndefined(data.cost_price)) {
        product.cost_price = parse.getNumberIfPositive(data.cost_price);
      }

      if(!_.isUndefined(data.regular_price)) {
        product.regular_price = parse.getNumberIfPositive(data.regular_price);
      }

      if(!_.isUndefined(data.sale_price)) {
        product.sale_price = parse.getNumberIfPositive(data.sale_price);
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
        product.stock_tracking = parse.getBooleanIfValid(data.stock_tracking) || false;
      }

      if(!_.isUndefined(data.stock_preorder)) {
        product.stock_preorder = parse.getBooleanIfValid(data.stock_preorder) || false;
      }

      if(!_.isUndefined(data.stock_backorder)) {
        product.stock_backorder = parse.getBooleanIfValid(data.stock_backorder) || false;
      }

      if(!_.isUndefined(data.brand_id) && (data.brand_id === null || data.brand_id === '')) {
        product.brand_id = parse.getObjectIDIfValid(data.brand_id);
      }

      if(!_.isUndefined(data.category_id) && (data.category_id === null || data.category_id === '')) {
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

  renameDocumentFields(language, item) {
    if(item) {
      item.id = item._id.toString();
      delete item._id;

      if(item.brand_id) {
        item.brand_id = item.brand_id.toString();
      }

      if(item.category_id) {
        item.category_id = item.category_id.toString();
      }

      if(item.name) {
        item.name = item.name[language];
      }

      if(item.description) {
        item.description = item.description[language];
      }

      if(item.meta_description) {
        item.meta_description = item.meta_description[language];
      }

      if(item.meta_title) {
        item.meta_title = item.meta_title[language];
      }

      if(item.tags) {
        item.tags = item.tags[language];
      }

      if(item.images && item.images.length > 0) {
        for(let i = 0; i < item.images.length; i++) {
          item.images[i].url = settings.url.uploads.products + '/' + item.id + '/' + item.images[i].filename;
        }
      }

      item.variable = item.variants && item.variants.length > 0;
      item.on_sale = false;
      item.price = item.regular_price;

      if(item.date_sale_from && item.date_sale_to) {
        const date_sale_from = new Date(item.date_sale_from);
        const date_sale_to = new Date(item.date_sale_to);
        const date_current = new Date();
        if(date_current > date_sale_from && date_current < date_sale_to) {
          item.on_sale = true;
          item.price = item.sale_price;
        }
      }

      // Status of product stock for the purpose of ordering (available, preorder, backorder, out_of_stock, discontinued)
      item.stock_status = "out_of_stock";
      if(item.stock_quantity > 0) {
        item.stock_status = "available";
      }

      if(item.stock_backorder) {
        item.stock_status = "backorder";
      }

      if(item.stock_preorder) {
        item.stock_status = "preorder";
      }

      if(item.discontinued) {
        item.stock_status = "discontinued";
      }
    }

    return item;
  }

  deleteProductImage(productId, imageId) {
    let language = 'en';
    return this.getSingleProduct(language, productId).then(item => {
      if(item.images && item.images.length > 0) {
        let imageData = item.images.find(i => i.id.toString() === imageId.toString());
        if(imageData) {
          let filename = imageData.filename;
          let filepath = settings.path.uploads.products + '/' + productId + '/' + filename;
          fs.removeSync(filepath);

          var imagesNew = item.images.filter(i => i.id.toString() !== imageId.toString());
          this.updateProduct(language, productId, { images: imagesNew }).then(() => {
            return true;
          });

        }
      }
    });
  }

  addProductImage(req, res) {
    let productId = req.params.id;
    let productObjectID = this.parseObjectID(productId);
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
            "alt": {},
            "position": 0,
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
  }

}

module.exports = new ProductsService();
