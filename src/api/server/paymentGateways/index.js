const OrdersService = require('../services/orders/orders');
const SettingsService = require('../services/settings/settings');
const PaymentGatewaysService = require('../services/settings/paymentGateways');

const PayPalCheckout = require('./PayPalCheckout');
const LiqPay = require('./LiqPay');

const getOptions = (orderId) => {
  return Promise.all([
    OrdersService.getSingleOrder(orderId),
    SettingsService.getSettings()
  ]).then(([order, settings]) => {
    if(order && order.payment_method_id){
      return PaymentGatewaysService.getGateway(order.payment_method_gateway).then(gatewaySettings => {

        const options = {
          gateway: order.payment_method_gateway,
          gatewaySettings: gatewaySettings,
          order: order,
          amount: order.grand_total,
          currency: settings.currency_code
        };

        return options;
      });
    }
  });
}

const getPaymentFormSettings = (orderId) => {
  return getOptions(orderId).then(options => {
    switch(options.gateway){
      case 'paypal-checkout':
        return PayPalCheckout.getPaymentFormSettings(options);
      case 'liqpay':
        return LiqPay.getPaymentFormSettings(options);
      default:
        return Promise.reject('Invalid gateway');
    }
  })
}

const paymentNotification = (req, res, gateway) => {
  return PaymentGatewaysService.getGateway(gateway).then(gatewaySettings => {
    const options = {
      gateway: gateway,
      gatewaySettings: gatewaySettings,
      req: req,
      res: res
    };

    switch(gateway){
      case 'paypal-checkout':
        return PayPalCheckout.paymentNotification(options);
      case 'liqpay':
        return LiqPay.paymentNotification(options);
      default:
        return Promise.reject('Invalid gateway');
    }
  });
}

module.exports = {
  getPaymentFormSettings: getPaymentFormSettings,
  paymentNotification: paymentNotification
}
