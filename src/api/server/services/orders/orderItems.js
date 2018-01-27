'use strict';

const settings = require('../../lib/settings');
const mongo = require('../../lib/mongo');
const utils = require('../../lib/utils');
const parse = require('../../lib/parse');
const ObjectID = require('mongodb').ObjectID;
const OrdersService = require('./orders');
const ProductsService = require('../products/products');
const ProductStockService = require('../products/stock');

class OrderItemsService {
  constructor() {}

  addItem(order_id, data) {
    if (!ObjectID.isValid(order_id)) {
      return Promise.reject('Invalid identifier');
    }
    let orderObjectID = new ObjectID(order_id);
    let newItem = this.getValidDocumentForInsert(data);

    return this.getOrderItemIfExists(order_id, newItem.product_id, newItem.variant_id).then(existItem => {
      if (existItem) {
        const quantityNeeded = existItem.quantity + newItem.quantity;
        return this.getAvailableProductQuantity(newItem.product_id, newItem.variant_id, quantityNeeded).then(availableQuantity => {
          if(availableQuantity > 0) {
            return this.updateItem(order_id, existItem.id, {
              quantity: availableQuantity
            });
          } else {
            return OrdersService.getSingleOrder(order_id);
          }
        })
      } else {
        return this.getAvailableProductQuantity(newItem.product_id, newItem.variant_id, newItem.quantity).then(availableQuantity => {
          if(availableQuantity > 0) {
            newItem.quantity = availableQuantity;
            return mongo.db.collection('orders').updateOne({
              _id: orderObjectID
            }, {
              $push: {
                items: newItem
              }
            })
            .then(() => this.calculateAndUpdateItem(order_id, newItem.id))
            .then(() => ProductStockService.handleAddOrderItem(order_id, newItem.id))
            .then(() => OrdersService.getSingleOrder(order_id));
          } else {
            return OrdersService.getSingleOrder(order_id);
          }
        })
      }
    })
  }

  getAvailableProductQuantity(product_id, variant_id, quantityNeeded) {
    return ProductsService.getSingleProduct(product_id.toString())
    .then(product => {
      if(!product) {
        return 0;
      } else if(product.discontinued){
        return 0;
      } else if(product.stock_backorder) {
        return quantityNeeded;
      } else if (product.variable && variant_id) {
        const variant = this.getVariantFromProduct(product, variant_id);
        if(variant){
          return variant.stock_quantity >= quantityNeeded ? quantityNeeded : variant.stock_quantity;
        } else {
          return 0;
        }
      } else {
        return product.stock_quantity >= quantityNeeded ? quantityNeeded : product.stock_quantity;
      }
    });
  }

  getOrderItemIfExists(order_id, product_id, variant_id) {
    let orderObjectID = new ObjectID(order_id);
    return mongo.db.collection('orders').findOne({
      _id: orderObjectID
    }, {items: 1}).then(order => {
      if(order && order.items && order.items.length > 0) {
        return order.items.find(item => item.product_id.toString() === product_id.toString() && (item.variant_id || '').toString() === (variant_id || '').toString());
      } else {
        return null;
      }
    });
  }

  updateItem(order_id, item_id, data) {
    if (!ObjectID.isValid(order_id) || !ObjectID.isValid(item_id)) {
      return Promise.reject('Invalid identifier');
    }
    let orderObjectID = new ObjectID(order_id);
    let itemObjectID = new ObjectID(item_id);
    const item = this.getValidDocumentForUpdate(data);

    if(parse.getNumberIfPositive(data.quantity) === 0) {
      // delete item
      return this.deleteItem(order_id, item_id);
    } else {
      // update
      return ProductStockService.handleDeleteOrderItem(order_id, item_id)
      .then(() => mongo.db.collection('orders').updateOne({
          _id: orderObjectID,
          'items.id': itemObjectID
        }, {$set: item}))
      .then(() => this.calculateAndUpdateItem(order_id, item_id))
      .then(() => ProductStockService.handleAddOrderItem(order_id, item_id))
      .then(() => OrdersService.getSingleOrder(order_id));
    }
  }

  getVariantFromProduct(product, variantId) {
    if(product.variants && product.variants.length > 0) {
      return product.variants.find(variant => variant.id.toString() === variantId.toString());
    } else {
      return null;
    }
  }

  getOptionFromProduct(product, optionId){
    if(product.options && product.options.length > 0) {
      return product.options.find(item => item.id.toString() === optionId.toString());
    } else {
      return null;
    }
  }

  getOptionValueFromProduct(product, optionId, valueId){
    const option = this.getOptionFromProduct(product, optionId);
    if(option && option.values && option.values.length > 0) {
      return option.values.find(item => item.id.toString() === valueId.toString());
    } else {
      return null;
    }
  }

  getOptionNameFromProduct(product, optionId){
    const option = this.getOptionFromProduct(product, optionId);
    return option ? option.name : null;
  }

  getOptionValueNameFromProduct(product, optionId, valueId){
    const value = this.getOptionValueFromProduct(product, optionId, valueId)
    return value ? value.name : null;
  }

  getVariantNameFromProduct(product, variantId) {
    const variant = this.getVariantFromProduct(product, variantId);
    if(variant) {
      let optionNames = [];
      for(const option of variant.options){
        const optionName = this.getOptionNameFromProduct(product, option.option_id);
        const optionValueName = this.getOptionValueNameFromProduct(product, option.option_id, option.value_id);
        optionNames.push(`${optionName}: ${optionValueName}`);
      }
      return optionNames.join(', ');
    }

    return null;
  }

  calculateAndUpdateItem(order_id, item_id) {
    // TODO: tax_total, discount_total

    let orderObjectID = new ObjectID(order_id);
    let itemObjectID = new ObjectID(item_id);

    return OrdersService.getSingleOrder(order_id).then(order => {
      if (order.items.length > 0) {
        let item = order.items.find(i => i.id.toString() === item_id.toString());
        if (item) {
          return ProductsService.getSingleProduct(item.product_id.toString()).then(product => {
            let newItemData = null;
            if(item.variant_id) {
              const variant = this.getVariantFromProduct(product, item.variant_id);
              const variantName = this.getVariantNameFromProduct(product, item.variant_id);

              if(!variant) {
                // variant not exists
                return null;
              }

              newItemData = {
                'items.$.sku': variant.sku,
                'items.$.name': product.name,
                'items.$.variant_name': variantName,
                'items.$.price': variant.price,
                'items.$.tax_class': product.tax_class,
                'items.$.tax_total': 0,
                'items.$.weight': variant.weight || 0,
                'items.$.discount_total': 0,
                'items.$.price_total': variant.price * item.quantity
              }
            } else {
              newItemData = {
                'items.$.sku': product.sku,
                'items.$.name': product.name,
                'items.$.variant_name': '',
                'items.$.price': product.price,
                'items.$.tax_class': product.tax_class,
                'items.$.tax_total': 0,
                'items.$.weight': product.weight || 0,
                'items.$.discount_total': 0,
                'items.$.price_total': product.price * item.quantity
              }
            }

            return mongo.db.collection('orders').updateOne({
              _id: orderObjectID,
              'items.id': itemObjectID
            }, {$set: newItemData});
          })
        } else {
          // item not exists
          return null;
        }
      } else {
        // order.items is empty
        return null;
      }
    })
  }

  calculateAndUpdateAllItems(order_id) {
    return OrdersService.getSingleOrder(order_id).then(order => {
      if (order && order.items && order.items.length > 0) {
        let promises = order.items.map(item => this.calculateAndUpdateItem(order_id, item.id));
        return Promise.all(promises).then(values => {
          return OrdersService.getSingleOrder(order_id)
        });
      } else {
        // order.items is empty
        return null;
      }
    })
  }

  deleteItem(order_id, item_id) {
    if (!ObjectID.isValid(order_id) || !ObjectID.isValid(item_id)) {
      return Promise.reject('Invalid identifier');
    }
    let orderObjectID = new ObjectID(order_id);
    let itemObjectID = new ObjectID(item_id);

    return ProductStockService.handleDeleteOrderItem(order_id, item_id)
    .then(() => mongo.db.collection('orders').updateOne({
      _id: orderObjectID
    }, {
      $pull: {
        items: {
          id: itemObjectID
        }
      }
    }))
    .then(() => OrdersService.getSingleOrder(order_id));
  }

  getValidDocumentForInsert(data) {
    return {
      'id': new ObjectID(),
      'product_id': parse.getObjectIDIfValid(data.product_id),
      'variant_id': parse.getObjectIDIfValid(data.variant_id),
      'quantity': parse.getNumberIfPositive(data.quantity) || 1
    }
  }

  getValidDocumentForUpdate(data) {
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
}

module.exports = new OrderItemsService();
