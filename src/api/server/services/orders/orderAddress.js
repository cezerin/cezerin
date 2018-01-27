'use strict';

const settings = require('../../lib/settings');
const mongo = require('../../lib/mongo');
const utils = require('../../lib/utils');
const parse = require('../../lib/parse');
const ObjectID = require('mongodb').ObjectID;
const OrdersService = require('./orders');

class OrderAddressService {
  constructor() {}

  updateBillingAddress(id, data) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const orderObjectID = new ObjectID(id);
    const billing_address = this.getValidDocumentForUpdate(id, data, 'billing_address');

    return mongo.db.collection('orders').updateOne({
      _id: orderObjectID
    }, {$set: billing_address}).then(res => OrdersService.getSingleOrder(id))
  }

  updateShippingAddress(id, data) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const orderObjectID = new ObjectID(id);
    const shipping_address = this.getValidDocumentForUpdate(id, data, 'shipping_address');

    return mongo.db.collection('orders').updateOne({
      _id: orderObjectID
    }, {$set: shipping_address}).then(res => OrdersService.getSingleOrder(id))
  }

  getValidDocumentForUpdate(id, data, addressTypeName) {
    const keys = Object.keys(data);
    if (keys.length === 0) {
      return new Error('Required fields are missing');
    }

    let address = {}

    keys.forEach(key => {
      const value = data[key];
      if(key === 'coordinates' || key === 'details'){
        address[`${addressTypeName}.${key}`] = value;
      } else {
        address[`${addressTypeName}.${key}`] = parse.getString(value);
      }
    })

    return address;
  }
}

module.exports = new OrderAddressService();
