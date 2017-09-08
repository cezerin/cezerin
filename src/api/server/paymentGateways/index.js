const PayPalCheckout = require('./PayPalCheckout');

const getPaymentFormSettings = (options) => {
  const { gateway, gatewaySettings, order, amount, currency } = options;

  switch(gateway){
    case 'paypal-checkout':
      return PayPalCheckout.getPaymentFormSettings(options);
    default:
      return Promise.reject('Invalid gateway');
  }
}

module.exports = {
  getPaymentFormSettings: getPaymentFormSettings
}
