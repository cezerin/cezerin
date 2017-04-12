'use strict';

var mongo = require('../../lib/mongo');
var parse = require('../../lib/parse');
var ObjectID = require('mongodb').ObjectID;

class ProductVariantsService {
  constructor() {}

  getVariants(productId) {
    if(!ObjectID.isValid(productId)) {
      return Promise.reject('Invalid identifier');
    }

    let productObjectID = new ObjectID(productId);
    return mongo.db.collection('products').findOne({ _id: productObjectID }, {fields: {variants: 1}}).then(product => product.variants || [])
  }

  deleteVariant(productId, variantId) {
    if(!ObjectID.isValid(productId) || !ObjectID.isValid(variantId)) {
      return Promise.reject('Invalid identifier');
    }
    let productObjectID = new ObjectID(productId);
    let variantObjectID = new ObjectID(variantId);

    return mongo.db.collection('products').updateOne({
      _id: productObjectID
    }, {
      $pull: {
        variants: {
          id: variantObjectID
        }
      }
    }).then(res => this.getVariants(productId));
  }

  addVariant(productId, data) {
    if(!ObjectID.isValid(productId)) {
      return Promise.reject('Invalid identifier');
    }
    let productObjectID = new ObjectID(productId);

    const variantData = this.getValidDocumentForInsert(data);

    return mongo.db.collection('products')
      .updateOne({ _id: productObjectID }, { $push: { variants: variantData } })
      .then(res => this.getVariants(productId));
  }

  updateVariant(productId, variantId, data) {
    if(!ObjectID.isValid(productId) || !ObjectID.isValid(variantId)) {
      return Promise.reject('Invalid identifier');
    }
    let productObjectID = new ObjectID(productId);
    let variantObjectID = new ObjectID(variantId);

    const variantData = this.getValidDocumentForUpdate(data);

    return mongo.db.collection('products').updateOne({
      _id: productObjectID,
      'variants.id': variantObjectID
    }, {$set: variantData}).then(res => this.getVariants(productId));
  }

  getValidDocumentForInsert(data) {
    let variant = {
      id: new ObjectID(),
      sku: parse.getString(data.sku),
      price: parse.getNumberIfPositive(data.price) || 0,
      stock_quantity: parse.getNumberIfPositive(data.stock_quantity) || 0,
      weight: parse.getNumberIfPositive(data.weight) || 0,
      options: []
    };

    return variant;
  }

  getValidDocumentForUpdate(data) {
    if (Object.keys(data).length === 0) {
      return new Error('Required fields are missing');
    }

    let variant = {};

    if (data.sku !== undefined) {
      variant['variants.$.sku'] = parse.getString(data.sku);
    }

    if (data.price !== undefined) {
      variant['variants.$.price'] = parse.getNumberIfPositive(data.price) || 0;
    }

    if (data.stock_quantity !== undefined) {
      variant['variants.$.stock_quantity'] = parse.getNumberIfPositive(data.stock_quantity) || 0;
    }

    if (data.weight !== undefined) {
      variant['variants.$.weight'] = parse.getNumberIfPositive(data.weight) || 0;
    }

    return variant;
  }
}

module.exports = new ProductVariantsService();
