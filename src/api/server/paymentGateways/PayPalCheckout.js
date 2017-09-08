const getPaymentFormSettings = (options) => {
  const { gateway, gatewaySettings, order, amount, currency } = options;

  const formSettings = {
    order_id: order.id,
    amount: amount,
    currency: currency,
    env: gatewaySettings.env,
    client: gatewaySettings.client,
    size: gatewaySettings.size,
    shape: gatewaySettings.shape,
    color: gatewaySettings.color
  };

  return Promise.resolve(formSettings);
}

module.exports = {
  getPaymentFormSettings: getPaymentFormSettings
}
