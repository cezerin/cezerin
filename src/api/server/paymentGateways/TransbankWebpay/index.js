const getPaymentFormSettings = options => {
  const { gateway, gatewaySettings, order, amount, currency } = options;

  const formSettings = {
    order_id: order.id,
    amount: amount,
    currency: currency,
  };

  return Promise.resolve(formSettings);
}

const paymentNotification = options => {
  console.log('options:', options)
}

module.exports = {
  getPaymentFormSettings: getPaymentFormSettings,
  paymentNotification: paymentNotification
}
