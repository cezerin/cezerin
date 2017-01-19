'use strict';

const settings = require('../../lib/settings');
var mongo = require('../../lib/mongo');
var utils = require('../../lib/utils');
var parse = require('../../lib/parse');
var ObjectID = require('mongodb').ObjectID;
var OrdersService = require('./orders');

class OrderItemsService {
  constructor() {}

  addItem(order_id, data) {
    if (!ObjectID.isValid(order_id)) {
      return Promise.reject('Invalid identifier');
    }
    let orderObjectID = new ObjectID(order_id);
    const item = this.getDocumentForInsert(data);

    return mongo.db.collection('orders').updateOne({
      _id: orderObjectID
    }, {
      $push: {
        items: item
      }
    });
  }

  updateItem(order_id, item_id, data) {
    if (!ObjectID.isValid(order_id) || !ObjectID.isValid(item_id)) {
      return Promise.reject('Invalid identifier');
    }
    let orderObjectID = new ObjectID(order_id);
    let itemObjectID = new ObjectID(item_id);
    const item = this.getDocumentForUpdate(data);

    return mongo.db.collection('orders').updateOne({
      _id: orderObjectID,
      'items.id': itemObjectID
    }, {$set: item}).then(res => OrdersService.getSingleOrder(order_id));
  }

  deleteItem(order_id, item_id) {
    if (!ObjectID.isValid(order_id) || !ObjectID.isValid(item_id)) {
      return Promise.reject('Invalid identifier');
    }
    let orderObjectID = new ObjectID(order_id);
    let itemObjectID = new ObjectID(item_id);

    return mongo.db.collection('orders').updateOne({
      _id: orderObjectID
    }, {
      $pull: {
        items: {
          id: itemObjectID
        }
      }
    }).then(res => OrdersService.getSingleOrder(order_id));
  }

  getDocumentForInsert(data) {
    return {
      'id': new ObjectID(),
      'product_id': parse.getObjectIDIfValid(data.product_id),
      'variant_id': parse.getObjectIDIfValid(data.variant_id),
      'quantity': parse.getNumberIfPositive(data.quantity) || 1
    }
  }

  getDocumentForUpdate(data) {
    if (Object.keys(data).length === 0) {
      return new Error('Required fields are missing');
    }

    let item = {};

    if (data.variant_id !== undefined) {
      item['items.$.variant_id'] = parse.getObjectIDIfValid(data.variant_id);
    }

    if (data.quantity !== undefined) {
      item['items.$.quantity'] = parse.getNumberIfPositive(data.quantity);
    }

    return item;
  }

  getErrorMessage(err) {
    return {'error': true, 'message': err.toString()};
  }
}

module.exports = new OrderItemsService();
