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

const paymentNotification = (options) => {
  console.log('options:', options)
  const { gateway, gatewaySettings, req, res } = options
  const params = req.body
  const dataStr = Buffer.from(params.data, 'base64').toString()
  const data = JSON.parse(dataStr)
  
  res.status(200).end()

  const sign = getHashFromString(gatewaySettings.private_key + params.data + gatewaySettings.private_key);
  const signatureValid = sign === params.signature;
  const paymentSuccess = data.status === 'success';
  const orderId = data.order_id;

  if(signatureValid && paymentSuccess){
    OrdersService.updateOrder(orderId, { paid: true, date_paid: new Date() }).then(() => {
      OrdertTansactionsService.addTransaction(orderId, {
        transaction_id: data.transaction_id,
        amount: data.amount,
        currency: data.currency,
        status: data.status,
        details: `${data.paytype}, ${data.sender_card_mask2}`,
        success: true
      });
    });
  } else {
    // log
  }
}

module.exports = {
  getPaymentFormSettings: getPaymentFormSettings,
  paymentNotification: paymentNotification
}
