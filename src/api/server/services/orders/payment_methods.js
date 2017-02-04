'use strict';

var mongo = require('../../lib/mongo');
var utils = require('../../lib/utils');
var parse = require('../../lib/parse');
var ObjectID = require('mongodb').ObjectID;
var PaymentMethodsLightService = require('./payment_methods_light');
var OrdersService = require('./orders');

class PaymentMethodsService {
  constructor() {}

  getFilter(params = {}) {
    return new Promise((resolve, reject) => {
      let filter = {};
      const id = parse.getObjectIDIfValid(params.id);
      if (id) {
        filter._id = new ObjectID(id);
      }

      const order_id = parse.getObjectIDIfValid(params.order_id);
      if (order_id) {
        return OrdersService.getSingleOrder(order_id).then(order => {
          if (order) {
            filter['$and'] = [];
            filter['$and'].push({
              $or: [
                {
                  'conditions.sub_total_min': 0
                }, {
                  'conditions.sub_total_min': {
                    $lte: order.sub_total
                  }
                }
              ]
            });
            filter['$and'].push({
              $or: [
                {
                  'conditions.sub_total_max': 0
                }, {
                  'conditions.sub_total_max': {
                    $gte: order.sub_total
                  }
                }
              ]
            });

            if (order.shipping_address.country && order.shipping_address.country.length > 0) {
              filter['$and'].push({
                $or: [
                  {
                    'conditions.countries': {
                      $size: 0
                    }
                  }, {
                    'conditions.countries': order.shipping_address.country
                  }
                ]
              });
            }

            if (order.shipping_method_id && order.shipping_method_id.length > 0) {
              filter['$and'].push({
                $or: [
                  {
                    'conditions.shipping_method_ids': {
                      $size: 0
                    }
                  }, {
                    'conditions.shipping_method_ids': order.shipping_method_id
                  }
                ]
              });
            }
          }
          resolve(filter);
        })
      } else {
        resolve(filter);
      }
    });
  }

  getMethods(params = {}) {
    return this.getFilter(params).then(filter => {
      return PaymentMethodsLightService.getMethods(filter);
    });
  }

  getSingleMethod(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    return this.getMethods({id: id}).then(methods => {
      return methods.length > 0
        ? methods[0]
        : null;
    })
  }

  addMethod(data) {
    const method = this.getDocumentForInsert(data);
    return mongo.db.collection('paymentMethods').insertMany([method]).then(res => this.getSingleMethod(res.ops[0]._id.toString()));
  }

  updateMethod(id, data) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const methodObjectID = new ObjectID(id);
    const method = this.getDocumentForUpdate(id, data);

    return mongo.db.collection('paymentMethods').updateOne({
      _id: methodObjectID
    }, {$set: method}).then(res => this.getSingleMethod(id));
  }

  deleteMethod(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const methodObjectID = new ObjectID(id);
    return mongo.db.collection('paymentMethods').deleteOne({'_id': methodObjectID});
  }

  getPaymentMethodConditions(conditions) {
    return conditions
      ? {
        'countries': parse.getArrayIfValid(conditions.countries) || [],
        'shipping_method_ids': parse.getArrayIfValid(conditions.shipping_method_ids) || [],
        'sub_total_min': parse.getNumberIfPositive(conditions.sub_total_min) || 0,
        'sub_total_max': parse.getNumberIfPositive(conditions.sub_total_max) || 0
      }
      : {
        'countries': [],
        'shipping_method_ids': [],
        'sub_total_min': null,
        'sub_total_max': null
      };
  }

  getDocumentForInsert(data) {
    let method = {
      // 'logo': '',
      // 'app_id': null,
      // 'app_settings': {}
    }

    method.name = parse.getString(data.name);
    method.description = parse.getString(data.description);
    method.position = parse.getNumberIfPositive(data.position) || 0;
    method.enabled = parse.getBooleanIfValid(data.enabled, true);
    method.conditions = this.getPaymentMethodConditions(data.conditions);

    return method;
  }

  getDocumentForUpdate(id, data) {
    if (Object.keys(data).length === 0) {
      return new Error('Required fields are missing');
    }

    let method = {}

    if (data.name !== undefined) {
      method.name = parse.getString(data.name);
    }

    if (data.description !== undefined) {
      method.description = parse.getString(data.description);
    }

    if (data.position !== undefined) {
      method.position = parse.getNumberIfPositive(data.position) || 0;
    }

    if (data.enabled !== undefined) {
      method.enabled = parse.getBooleanIfValid(data.enabled, true);
    }

    if (data.conditions !== undefined) {
      method.conditions = this.getPaymentMethodConditions(data.conditions);
    }

    return method;
  }
}

module.exports = new PaymentMethodsService();
