'use strict';

var mongo = require('../../lib/mongo');
var ObjectID = require('mongodb').ObjectID;

class ShippingMethodsLightService {
  constructor() {}

  getMethods(filter = {}) {
    return mongo.db.collection('shippingMethods').find(filter).toArray().then(items => items.map(item => this.renameDocumentFields(item)));
  }

  getMethodPrice(id) {
    let filter = {};
    if (id) {
      filter._id = new ObjectID(id);
    }

    return this.getMethods(filter).then(methods => {
      return methods.length > 0
        ? methods[0].price || 0
        : 0
    })
  }

  renameDocumentFields(item) {
    if (item) {
      item.id = item._id.toString();
      delete item._id;
    }
    return item;
  }
}

module.exports = new ShippingMethodsLightService();
