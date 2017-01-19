'use strict';

const settings = require('../../lib/settings');
var mongo = require('../../lib/mongo');
var utils = require('../../lib/utils');
var parse = require('../../lib/parse');
var ObjectID = require('mongodb').ObjectID;
var OrdersService = require('./orders');

class OrdertTansactionsService {
  constructor() {}

  addTransaction(order_id, data) {
    if (!ObjectID.isValid(order_id)) {
      return Promise.reject('Invalid identifier');
    }
    let orderObjectID = new ObjectID(order_id);
    const transaction = this.getDocumentForInsert(data);

    return mongo.db.collection('orders').updateOne({
      _id: orderObjectID
    }, {
      $push: {
        transactions: transaction
      }
    });
  }

  updateTransaction(order_id, transaction_id, data) {
    if (!ObjectID.isValid(order_id) || !ObjectID.isValid(transaction_id)) {
      return Promise.reject('Invalid identifier');
    }
    let orderObjectID = new ObjectID(order_id);
    let transactionObjectID = new ObjectID(transaction_id);
    const transaction = this.getDocumentForUpdate(data);

    return mongo.db.collection('orders').updateOne({
      _id: orderObjectID,
      'transactions.id': transactionObjectID
    }, {$set: transaction}).then(res => OrdersService.getSingleOrder(order_id));
  }

  deleteTransaction(order_id, transaction_id) {
    if (!ObjectID.isValid(order_id) || !ObjectID.isValid(transaction_id)) {
      return Promise.reject('Invalid identifier');
    }
    let orderObjectID = new ObjectID(order_id);
    let transactionObjectID = new ObjectID(transaction_id);

    return mongo.db.collection('orders').updateOne({
      _id: orderObjectID
    }, {
      $pull: {
        transactions: {
          id: transactionObjectID
        }
      }
    }).then(res => OrdersService.getSingleOrder(order_id));
  }

  getDocumentForInsert(data) {
    return {
      'id': new ObjectID(),
      'transaction_id': parse.getString(data.transaction_id),
      'amount': parse.getNumberIfPositive(data.amount) || 0,
      'currency': parse.getCurrencyIfValid(data.currency) || settings.currency,
      'status': parse.getString(data.status),
      'details': parse.getString(data.details),
      'success': parse.getBooleanIfValid(data.success)
    }
  }

  getDocumentForUpdate(data) {
    if (Object.keys(data).length === 0) {
      return new Error('Required fields are missing');
    }

    let transaction = {};

    if (data.transaction_id !== undefined) {
      transaction['transactions.$.transaction_id'] = parse.getString(data.transaction_id);
    }

    if (data.amount !== undefined) {
      transaction['transactions.$.amount'] = parse.getNumberIfPositive(data.amount) || 0;
    }

    if (data.currency !== undefined) {
      transaction['transactions.$.currency'] = parse.getCurrencyIfValid(data.currency) || settings.currency;
    }

    if (data.status !== undefined) {
      transaction['transactions.$.status'] = parse.getString(data.status);
    }

    if (data.details !== undefined) {
      transaction['transactions.$.details'] = parse.getString(data.details);
    }

    if (data.success !== undefined) {
      transaction['transactions.$.success'] = parse.getBooleanIfValid(data.success);
    }

    return transaction;
  }

  getErrorMessage(err) {
    return {'error': true, 'message': err.toString()};
  }
}

module.exports = new OrdertTansactionsService();
