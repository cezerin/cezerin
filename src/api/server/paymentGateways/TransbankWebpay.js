const OrdersService = require('../services/orders/orders');
const OrdertTansactionsService = require('../services/orders/orderTransactions');
const fetch = require('node-fetch');
const mongo = require('../lib/mongo');

const getPaymentFormSettings = options => {
	const { gateway, gatewaySettings, order, amount, currency } = options;

	const formSettings = {
		order_id: order.id,
		orderNumber: order.number,
		clientEmail: order.email,
		clientName:
			order.billing_address.full_name || order.shipping_address.full_name,
		clientMobile: order.mobile,
		amount,
		currency,
		commerceCode: gatewaySettings['public-key']
	};

	return Promise.resolve(formSettings);
};

const paymentNotification = options => {
	const { gateway, gatewaySettings, req, res } = options;
	const params = req.body;
	const dataStr = Buffer.from(params.data, 'base64').toString();
	const data = JSON.parse(dataStr);

	res.status(200).end();

	// Make a call to Qvo api with transaction id to veriify payment
	const orderId = data.order_id;
	const transactionVerified = verify(data.transactionId);

	if (transactionVerified) {
		OrdersService.updateOrder(orderId, {
			paid: true,
			date_paid: new Date()
		}).then(() => {
			OrdertTansactionsService.addTransaction(orderId, {
				transaction_id: data.transaction_id,
				amount: data.amount,
				currency: data.currency,
				status: data.status,
				success: true
			});
		});
	} else {
		console.error(`Qvo Transaction failed`);
	}
};

const verify = async transactionId => {
	const qvoSettings = mongo.db
		.collection('paymentGateways')
		.findOne({ name: 'qvo' }, { 'private-key': 1 });
	const transaction = await fetch(
		`https://api.qvo.cl/transactions/${transactionId}`,
		{
			headers: {
				Authorization: `Bearer ${qvoSettings['private-key']}`
			}
		}
	);

	if (transaction.status === 'successful') return true;
	return false;
};

module.exports = {
	getPaymentFormSettings: getPaymentFormSettings,
	paymentNotification: paymentNotification
};
