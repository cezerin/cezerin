'use strict';

const settings = require('../../lib/settings');
var mongo = require('../../lib/mongo');
var utils = require('../../lib/utils');
var parse = require('../../lib/parse');
var ObjectID = require('mongodb').ObjectID;
var ProductsService = require('../products/products');
var CustomersService = require('../customers/customers');
var OrderStatusesService = require('./order_statuses');
var PaymentMethodsLightService = require('./payment_methods_light');
var ShippingMethodsLightService = require('./shipping_methods_light');

class OrdersService {
  constructor() {}

  getFilter(params = {}) {
    // TODO: sort, coupon, tag, channel
    let filter = {};
    const id = parse.getObjectIDIfValid(params.id);
    const status_id = parse.getObjectIDIfValid(params.status_id);
    const customer_id = parse.getObjectIDIfValid(params.customer_id);
    const payment_method_id = parse.getObjectIDIfValid(params.payment_method_id);
    const shipping_method_id = parse.getObjectIDIfValid(params.shipping_method_id);
    const closed = parse.getBooleanIfValid(params.closed);
    const cancelled = parse.getBooleanIfValid(params.cancelled);
    const delivered = parse.getBooleanIfValid(params.delivered);
    const paid = parse.getBooleanIfValid(params.paid);
    const draft = parse.getBooleanIfValid(params.draft);
    const hold = parse.getBooleanIfValid(params.hold);
    const grand_total_min = parse.getNumberIfPositive(params.grand_total_min);
    const grand_total_max = parse.getNumberIfPositive(params.grand_total_max);
    const date_created_min = parse.getDateIfValid(params.date_created_min);
    const date_created_max = parse.getDateIfValid(params.date_created_max);
    const date_completed_min = parse.getDateIfValid(params.date_completed_min);
    const date_completed_max = parse.getDateIfValid(params.date_completed_max);

    if (id) {
      filter._id = new ObjectID(id);
    }

    if (status_id) {
      filter.status_id = status_id;
    }

    if (customer_id) {
      filter.customer_id = customer_id;
    }

    if (payment_method_id) {
      filter.payment_method_id = payment_method_id;
    }

    if (shipping_method_id) {
      filter.shipping_method_id = shipping_method_id;
    }

    if (params.number) {
      filter.number = params.number;
    }

    if (closed !== null) {
      filter.closed = closed;
    }

    if (cancelled !== null) {
      filter.cancelled = cancelled;
    }

    if (delivered !== null) {
      filter.delivered = delivered;
    }

    if (paid !== null) {
      filter.paid = paid;
    }

    if (draft !== null) {
      filter.draft = draft;
    }

    if (hold !== null) {
      filter.hold = hold;
    }

    if (grand_total_min || grand_total_max) {
      filter.grand_total = {};
      if (grand_total_min) {
        filter.grand_total['$gte'] = grand_total_min;
      }
      if (grand_total_max) {
        filter.grand_total['$lte'] = grand_total_max;
      }
    }

    if (date_created_min || date_created_max) {
      filter.date_created = {};
      if (date_created_min) {
        filter.date_created['$gte'] = date_created_min.toISOString();
      }
      if (date_created_max) {
        filter.date_created['$lte'] = date_created_max.toISOString();
      }
    }

    if (date_completed_min || date_completed_max) {
      filter.date_completed = {};
      if (date_completed_min) {
        filter.date_completed['$gte'] = date_completed_min.toISOString();
      }
      if (date_completed_max) {
        filter.date_completed['$lte'] = date_completed_max.toISOString();
      }
    }

    if (params.search) {
      filter['$text'] = {
        '$search': params.search
        // +
        // 'number':'text',
        // 'referrer_url':'text',
        // 'landing_url':'text',
        // 'coupon':'text',
      };
    }

    return filter;
  }

  getOrders(params) {
    return Promise.all([OrderStatusesService.getStatuses(), ShippingMethodsLightService.getMethods(), PaymentMethodsLightService.getMethods()]).then(([orderStatuses, shippingMethods, paymentMethods]) => {
      let filter = this.getFilter(params);
      const limit = parse.getNumberIfPositive(params.limit) || 1000000;
      const offset = parse.getNumberIfPositive(params.offset) || 0;

      return mongo.db.collection('orders').find(filter).sort({date_created: -1}).skip(offset).limit(limit).toArray().then(orders => orders.map(order => {
        return this.renameDocumentFields(order, orderStatuses, shippingMethods, paymentMethods);
      }));
    });
  }

  getSingleOrder(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    return this.getOrders({id: id}).then(orders => {
      return orders.length > 0
        ? orders[0]
        : null;
    })
  }

  associateOrderWithCustomer(order) {
    /*
    1. check customer_id
    2. find customer by email
    3. if customer exists - set new customer_id
    3. if customer not exists - create new customer and set new customer_id
    */

    if (!order.customer_id && order.email) {
      return CustomersService.getCustomers({email: order.email}).then(customers => {
        if (customers && customers.length > 0) {
          order.customer_id = customers[0].id;
          return order;
        } else {
          var addresses = [];
          if (order.shipping_address) {
            addresses.push(order.shipping_address);
          }

          var customerrFullName = order.shipping_address && order.shipping_address.full_name
            ? order.shipping_address.full_name
            : '';

          return CustomersService.addCustomer({email: order.email, full_name: customerrFullName, mobile: order.mobile, browser: order.browser, addresses: addresses}).then(customer => {
            order.customer_id = customer.id;
            return order;
          });
        }
      })
    } else {
      return order;
    }
  }

  addOrder(data) {
    return this.getDocumentForInsert(data).then(this.associateOrderWithCustomer).then(order => mongo.db.collection('orders').insertMany([order])).then(res => this.getSingleOrder(res.ops[0]._id.toString()))
  }

  updateOrder(id, data) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const orderObjectID = new ObjectID(id);
    return this.getDocumentForUpdate(id, data).then(order => mongo.db.collection('orders').updateOne({
      _id: orderObjectID
    }, {$set: order}).then(res => this.getSingleOrder(id)));
  }

  deleteOrder(orderId) {
    if (!ObjectID.isValid(orderId)) {
      return Promise.reject('Invalid identifier');
    }
    const orderObjectID = new ObjectID(orderId);
    return mongo.db.collection('orders').deleteOne({'_id': orderObjectID}).then(res => {
      return true;
    });
  }

  getErrorMessage(err) {
    return {'error': true, 'message': err.toString()};
  }

  parseDiscountItem(discount) {
    return discount
      ? {
        'id': new ObjectID(),
        'name': parse.getString(discount.name),
        'amount': parse.getNumberIfPositive(discount.amount)
      }
      : null;
  }

  parseProductItem(item) {
    return item
      ? {
        'id': new ObjectID(),
        'product_id': parse.getObjectIDIfValid(item.product_id),
        'variant_id': parse.getObjectIDIfValid(item.variant_id),
        'quantity': parse.getNumberIfPositive(item.quantity)
        // "sku":"",
        // "name":"",
        // "variant_name":"",
        // "price":"",
        // "tax_class":"",
        // "tax_total":"",
        // "weight":"",
        // "discount_total":"",
        // "price_total":"", //price * quantity
      }
      : null;
  }

  parseTransactionItem(transaction) {
    return transaction
      ? {
        'id': new ObjectID(),
        'transaction_id': parse.getString(transaction.transaction_id),
        'amount': parse.getNumberIfPositive(transaction.amount),
        'currency': parse.getCurrencyIfValid(transaction.currency) || settings.currency,
        'status': parse.getString(transaction.status),
        'details': transaction.details,
        'success': parse.getBooleanIfValid(transaction.success),
        'date_created': new Date(),
        'date_updated': null
      }
      : null;
  }

  getDocumentForInsert(data) {
    return mongo.db.collection('orders').find({}, {number: 1}).sort({number: -1}).limit(1).toArray().then(items => {
      let orderNumber = settings.order_start_number;
      if (items && items.length > 0) {
        orderNumber = items[0].number + 1;
      }

      let order = {
        'date_created': new Date(),
        'date_updated': null,
        'date_completed': null,
        'date_paid': null,
        'date_cancelled': null,
        'number': orderNumber,
        'shipping_status': ''
        // 'weight_total': 0,
        // 'discount_total': 0, //sum(items.discount_total)+sum(discounts.amount)
        // 'tax_included_total': 0, //if(item_tax_included, 0, item_tax) + if(shipment_tax_included, 0, shipping_tax)
        // 'tax_total': 0, //item_tax + shipping_tax
        // 'sub_total': 0, //sum(items.price_total)
        // 'shipping_total': 0, //shipping_price-shipping_discount
        // 'grand_total': 0 //sub_total + shipping_total + tax_included_total - (discount_total)
      }

      order.items = data.items && data.items.length > 0
        ? data.items.map(item => this.parseProductItem(item))
        : [];
      order.transactions = data.transactions && data.transactions.length > 0
        ? data.transactions.map(transaction => this.parseTransactionItem(transaction))
        : [];
      order.discounts = data.discounts && data.discounts.length > 0
        ? data.discounts.map(discount => this.parseDiscountItem(discount))
        : [];

      order.billing_address = parse.getOrderAddress(data.billing_address);
      order.shipping_address = parse.getOrderAddress(data.shipping_address);

      order.item_tax = parse.getNumberIfPositive(data.item_tax) || 0;
      order.shipping_tax = parse.getNumberIfPositive(data.shipping_tax) || 0;
      order.shipping_discount = parse.getNumberIfPositive(data.shipping_discount) || 0;
      order.shipping_price = parse.getNumberIfPositive(data.shipping_price) || 0;

      order.item_tax_included = parse.getBooleanIfValid(data.item_tax_included, true);
      order.shipping_tax_included = parse.getBooleanIfValid(data.shipping_tax_included, true);
      order.closed = parse.getBooleanIfValid(data.closed, false);
      order.cancelled = parse.getBooleanIfValid(data.cancelled, false);
      order.delivered = parse.getBooleanIfValid(data.delivered, false);
      order.paid = parse.getBooleanIfValid(data.paid, false);
      order.hold = parse.getBooleanIfValid(data.hold, false);
      order.draft = parse.getBooleanIfValid(data.draft, true);

      order.email = parse.getString(data.email);
      order.mobile = parse.getString(data.mobile);
      order.referrer_url = parse.getString(data.referrer_url);
      order.landing_url = parse.getString(data.landing_url);
      order.channel = parse.getString(data.channel);
      order.note = parse.getString(data.note);
      order.comments = parse.getString(data.comments);
      order.coupon = parse.getString(data.coupon);
      order.currency = parse.getCurrencyIfValid(data.currency) || settings.currency;
      order.tracking_number = parse.getString(data.tracking_number);

      order.customer_id = parse.getObjectIDIfValid(data.customer_id);
      order.status_id = parse.getObjectIDIfValid(data.status_id);
      order.payment_method_id = parse.getObjectIDIfValid(data.payment_method_id);
      order.shipping_method_id = parse.getObjectIDIfValid(data.shipping_method_id);

      order.tags = parse.getArrayIfValid(data.tags) || [];
      order.browser = parse.getBrowser(data.browser);

      return order;
    });
  }

  getDocumentForUpdate(id, data) {
    return new Promise((resolve, reject) => {
      if (Object.keys(data).length === 0) {
        reject(new Error('Required fields are missing'));
      }

      let order = {
        'date_updated': new Date()
      }

      if (data.item_tax !== undefined) {
        order.item_tax = parse.getNumberIfPositive(data.item_tax) || 0;
      }
      if (data.shipping_tax !== undefined) {
        order.shipping_tax = parse.getNumberIfPositive(data.shipping_tax) || 0;
      }
      if (data.shipping_discount !== undefined) {
        order.shipping_discount = parse.getNumberIfPositive(data.shipping_discount) || 0;
      }
      if (data.shipping_price !== undefined) {
        order.shipping_price = parse.getNumberIfPositive(data.shipping_price) || 0;
      }
      if (data.item_tax_included !== undefined) {
        order.item_tax_included = parse.getBooleanIfValid(data.item_tax_included, true);
      }
      if (data.shipping_tax_included !== undefined) {
        order.shipping_tax_included = parse.getBooleanIfValid(data.shipping_tax_included, true);
      }
      if (data.closed !== undefined) {
        order.closed = parse.getBooleanIfValid(data.closed, false);
      }
      if (data.cancelled !== undefined) {
        order.cancelled = parse.getBooleanIfValid(data.cancelled, false);
      }
      if (data.delivered !== undefined) {
        order.delivered = parse.getBooleanIfValid(data.delivered, false);
      }
      if (data.paid !== undefined) {
        order.paid = parse.getBooleanIfValid(data.paid, false);
      }
      if (data.hold !== undefined) {
        order.hold = parse.getBooleanIfValid(data.hold, false);
      }
      if (data.draft !== undefined) {
        order.draft = parse.getBooleanIfValid(data.draft, true);
      }
      if (data.email !== undefined) {
        order.email = parse.getString(data.email);
      }
      if (data.mobile !== undefined) {
        order.mobile = parse.getString(data.mobile);
      }
      if (data.referrer_url !== undefined) {
        order.referrer_url = parse.getString(data.referrer_url);
      }
      if (data.landing_url !== undefined) {
        order.landing_url = parse.getString(data.landing_url);
      }
      if (data.channel !== undefined) {
        order.channel = parse.getString(data.channel);
      }
      if (data.note !== undefined) {
        order.note = parse.getString(data.note);
      }
      if (data.comments !== undefined) {
        order.comments = parse.getString(data.comments);
      }
      if (data.coupon !== undefined) {
        order.coupon = parse.getString(data.coupon);
      }
      if (data.currency !== undefined) {
        order.currency = parse.getCurrencyIfValid(data.currency) || settings.currency;
      }
      if (data.tracking_number !== undefined) {
        order.tracking_number = parse.getString(data.tracking_number);
      }
      if (data.shipping_status !== undefined) {
        order.shipping_status = parse.getString(data.shipping_status);
      }
      if (data.customer_id !== undefined) {
        order.customer_id = parse.getObjectIDIfValid(data.customer_id);
      }
      if (data.status_id !== undefined) {
        order.status_id = parse.getObjectIDIfValid(data.status_id);
      }
      if (data.payment_method_id !== undefined) {
        order.payment_method_id = parse.getObjectIDIfValid(data.payment_method_id);
      }
      if (data.shipping_method_id !== undefined) {
        order.shipping_method_id = parse.getObjectIDIfValid(data.shipping_method_id);
      }
      if (data.tags !== undefined) {
        order.tags = parse.getArrayIfValid(data.tags) || [];
      }
      if (data.browser !== undefined) {
        order.browser = parse.getBrowser(data.browser);
      }

      if (order.shipping_method_id && !order.shipping_price) {
        ShippingMethodsLightService.getMethodPrice(order.shipping_method_id).then(shippingPrice => {
          order.shipping_price = shippingPrice;
          resolve(order);
        })
      } else {
        resolve(order);
      }

    });
  }

  renameDocumentFields(order, orderStatuses, shippingMethods, paymentMethods) {
    if (order) {
      order.id = order._id.toString();
      delete order._id;

      let orderStatus = (order.status_id && orderStatuses.length > 0)
        ? orderStatuses.find(i => i.id === order.status_id)
        : null;
      let orderShippingMethod = (order.shipping_method_id && shippingMethods.length > 0)
        ? shippingMethods.find(i => i.id === order.shipping_method_id)
        : null;
      let orderPaymentMethod = (order.payment_method_id && paymentMethods.length > 0)
        ? paymentMethods.find(i => i.id === order.payment_method_id)
        : null;

      order.status = orderStatus
        ? orderStatus.name
        : '';
      order.shipping_method = orderShippingMethod
        ? orderShippingMethod.name
        : '';
      order.payment_method = orderPaymentMethod
        ? orderPaymentMethod.name
        : '';

      let sum_items_weight = 0;
      let sum_items_price_total = 0;
      let sum_items_discount_total = 0;
      let sum_discounts_amount = 0;
      let tax_included_total = (order.item_tax_included
        ? 0
        : order.item_tax) + (order.shipping_tax_included
        ? 0
        : order.shipping_tax);

      if (order.items && order.items.length > 0) {
        order.items.forEach(item => {
          let item_weight = item.weight * item.quantity;
          if (item_weight > 0) {
            sum_items_weight += item_weight;
          }
        })

        order.items.forEach(item => {
          if (item.price_total > 0) {
            sum_items_price_total += item.price_total;
          }
        })

        order.items.forEach(item => {
          if (item.discount_total > 0) {
            sum_items_discount_total += item.discount_total;
          }
        })
      }

      if (order.discounts && order.discounts.length > 0) {
        order.items.forEach(item => {
          if (item.amount > 0) {
            sum_discounts_amount += item.amount;
          }
        })
      }

      let tax_total = order.item_tax + order.shipping_tax;
      let shipping_total = order.shipping_price - order.shipping_discount;
      let discount_total = sum_items_discount_total + sum_discounts_amount;
      let grand_total = sum_items_price_total + shipping_total + tax_included_total - discount_total;

      order.weight_total = sum_items_weight;
      order.discount_total = discount_total; //sum(items.discount_total)+sum(discounts.amount)
      order.sub_total = sum_items_price_total; //sum(items.price_total)
      order.tax_included_total = tax_included_total; //if(item_tax_included, 0, item_tax) + if(shipment_tax_included, 0, shipping_tax)
      order.tax_total = tax_total; //item_tax + shipping_tax
      order.shipping_total = shipping_total; //shipping_price-shipping_discount
      order.grand_total = grand_total; //sub_total + shipping_total + tax_included_total - (discount_total)
    }

    return order;
  }
}

module.exports = new OrdersService();
