const getPaymentFormSettings = options => {
  const { gateway, gatewaySettings, order, amount, currency } = options
  console.log('order:', order)
  console.log('gatewaySettings:', gatewaySettings)

  const formSettings = {
    order_id: order.id,
    orderNumber: order.number,
    clientEmail: order.email,
    clientName: order.billing_address.full_name || order.shipping_address.full_name,
    clientMobile: order.mobile,
    amount,
    currency,
    publicKey: gatewaySettings['public-key'],
    storeName: gatewaySettings['store-name'],
    logo: gatewaySettings.logo
  }

  return Promise.resolve(formSettings);
}

const paymentNotification = options => {
  console.log('options:', options)
}

module.exports = {
  getPaymentFormSettings: getPaymentFormSettings,
  paymentNotification: paymentNotification
}
