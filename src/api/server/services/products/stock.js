'use strict';

var mongo = require('../../lib/mongo');
var ObjectID = require('mongodb').ObjectID;
const ProductsService = require('./products');
const ProductVariantsService = require('./variants');

class ProductStockService {
  handleOrderCheckout(orderId) {
    return this.getOrder(orderId).then(order => {
      if(order && order.items.length > 0) {
        let promises = order.items.map(item => this.decrementStockQuantity(item.product_id, item.variant_id, item.quantity));
        return Promise.all(promises);
      }
    })
  }

  handleCancelOrder(orderId) {
    return this.getOrder(orderId).then(order => {
      if(order && order.items.length > 0) {
        let promises = order.items.map(item => this.incrementStockQuantity(item.product_id, item.variant_id, item.quantity));
        return Promise.all(promises);
      }
    })
  }

  handleAddOrderItem(orderId, itemId) {
    return this.getOrderItem(orderId, itemId).then(item => {
      if(item) {
        return this.decrementStockQuantity(item.product_id, item.variant_id, item.quantity);
      } else {
        return null;
      }
    })
  }

  handleDeleteOrderItem(orderId, itemId) {
    return this.getOrderItem(orderId, itemId).then(item => {
      if(item) {
        return this.incrementStockQuantity(item.product_id, item.variant_id, item.quantity);
      } else {
        return null;
      }
    })
  }

  incrementStockQuantity(productId, variantId, quantity) {
    return this.changeStockQuantity(productId, variantId, quantity)
  }

  decrementStockQuantity(productId, variantId, quantity) {
    return this.changeStockQuantity(productId, variantId, quantity * -1);
  }

  changeStockQuantity(productId, variantId, quantity) {
    return ProductsService.getSingleProduct(productId).then(product => {
      if(this.isStockTrackingEnabled(product)) {
        let currentQuantity = 0;
        if(this.isVariant(variantId)) {
          currentQuantity = this.getVariantQuantityFromProduct(product, variantId);
        } else {
          currentQuantity = product.stock_quantity || 0;
        }
        const newQuantity = currentQuantity + quantity;
        return this.updateProductStockQuantity(productId, variantId, newQuantity);
      } else {
        return;
      }
    })
  }

  getVariantQuantityFromProduct(product, variantId) {
    const variants = product.variants;
    if(variants && variants.length > 0){
      const variant = variants.find(v => v.id.toString() === variantId.toString());
      if(variant){
        return variant.stock_quantity || 0;
      }
    }

    return 0;
  }

  updateProductStockQuantity(productId, variantId, quantity) {
    const data = {stock_quantity: quantity};
    if(this.isVariant(variantId)) {
      return ProductVariantsService.updateVariant(productId, variantId, data)
    } else {
      return ProductsService.updateProduct(productId, data)
    }
  }

  isStockTrackingEnabled(product) {
    return product.stock_tracking === true;
  }

  isVariant(variantId) {
    return variantId && variantId.length > 0;
  }

  getOrder(orderId) {
    const filter = {
      _id: new ObjectID(orderId),
      draft: false
    }

    return mongo.db.collection('orders').find(filter).toArray().then(orders => {
      return orders && orders.length > 0 ? orders[0] : null;
    })
  }

  getOrderItem(orderId, itemId) {
    return this.getOrder(orderId).then(order => {
      if(order && order.items.length > 0) {
        return order.items.find(item => item.id.toString() === itemId.toString());
      } else {
        return null;
      }
    })
  }
}

module.exports = new ProductStockService();
