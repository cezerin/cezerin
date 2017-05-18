'use strict';

const settings = require('../../lib/settings');
var mongo = require('../../lib/mongo');
var utils = require('../../lib/utils');
var parse = require('../../lib/parse');
var ObjectID = require('mongodb').ObjectID;
var OrdersService = require('./orders');

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
    if (Object.keys(data).length === 0) {
      return new Error('Required fields are missing');
    }

    let address = {}

    if (data.address1 !== undefined) {
      address[`${addressTypeName}.address1`] = parse.getString(data.address1);
    }

    if (data.address2 !== undefined) {
      address[`${addressTypeName}.address2`] = parse.getString(data.address2);
    }

    if (data.city !== undefined) {
      address[`${addressTypeName}.city`] = parse.getString(data.city);
    }

    if (data.country !== undefined) {
      address[`${addressTypeName}.country`] = parse.getString(data.country).toUpperCase();
    }

    if (data.state !== undefined) {
      address[`${addressTypeName}.state`] = parse.getString(data.state);
    }

    if (data.phone !== undefined) {
      address[`${addressTypeName}.phone`] = parse.getString(data.phone);
    }

    if (data.zip !== undefined) {
      address[`${addressTypeName}.zip`] = parse.getString(data.zip);
    }

    if (data.full_name !== undefined) {
      address[`${addressTypeName}.full_name`] = parse.getString(data.full_name);
    }

    if (data.company !== undefined) {
      address[`${addressTypeName}.company`] = parse.getString(data.company);
    }

    if (data.tax_number !== undefined) {
      address[`${addressTypeName}.tax_number`] = parse.getString(data.tax_number);
    }

    if (data.coordinates !== undefined) {
      address[`${addressTypeName}.coordinates`] = data.coordinates;
    }

    if (data.details !== undefined) {
      address[`${addressTypeName}.details`] = data.details;
    }

    return address;
  }
}

module.exports = new OrderAddressService();
