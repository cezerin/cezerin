const https = require('https');
const qs = require('query-string');
const OrdersService = require('../services/orders/orders');
const OrdertTansactionsService = require('../services/orders/orderTransactions');
const stripe = require('stripe')('sk_test_Rl4uAqtrZSF6gAnxmd92mDsC');

const SANDBOX_URL = 'www.sandbox.paypal.com';
const REGULAR_URL = 'www.paypal.com';

const getPaymentFormSettings = (options) => {
  const { gateway, gatewaySettings, order, amount, currency } = options;

  const formSettings = {
    order_id: order.id,
    amount: amount,
    currency: currency,
    email: order.email,
    api_key: gatewaySettings.api_key,
    notify_url: gatewaySettings.notify_url
  };

  return Promise.resolve(formSettings);
}

const processPayment = (options) => {
  const { gateway, gatewaySettings, req, res } = options;
  const params = req.body;
  const orderId = params.order.id;

  res.status(200).end();

  process(params)
    .then((payment) => {
      OrdersService.updateOrder(orderId, { paid: true, date_paid: new Date() });

      return payment;
    })
    .then((payment) => {
      return OrdertTansactionsService.addTransaction(orderId, {
        transaction_id: payment.id,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
        details: `${payment.source.name}, ${params.email}`,
        success: true
      });
    })
    .catch((e) => {
      console.error(e);
    })
}

const process = (params) => {
  return new Promise((resolve, reject) => {

    if (!params || Object.keys(params).length === 0) {
      return reject('Params is empty');
    }

    const charge = stripe.charges.create({
      amount: params.amount * 100,
      currency: params.currency,
      description: params.statement,
      statement_descriptor: params.statement,
      metadata: {
        order_id: params.order.id
      },
      source: params.stripeToken.id
    }).then(function(response) {
      return resolve(response);
    }, function(err) {
      return reject('Stripe Payment Processing error: ' + err);
    });
  });
};


module.exports = {
  getPaymentFormSettings: getPaymentFormSettings,
  processPayment: processPayment
}
