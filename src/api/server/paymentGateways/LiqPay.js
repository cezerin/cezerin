import crypto from 'crypto';
import OrdersService from '../services/orders/orders';
import OrdertTansactionsService from '../services/orders/orderTransactions';

const getPaymentFormSettings = options => {
	const { gateway, gatewaySettings, order, amount, currency } = options;
	const params = {
		sandbox: '0',
		action: 'pay',
		version: '3',
		amount: amount,
		currency: currency,
		description: 'Order: ' + order.number,
		order_id: order.id,
		public_key: gatewaySettings.public_key,
		language: gatewaySettings.language,
		server_url: gatewaySettings.server_url
	};

	const form = getForm(params, gatewaySettings.private_key);

	const formSettings = {
		data: form.data,
		signature: form.signature,
		language: gatewaySettings.language
	};

	return Promise.resolve(formSettings);
};

const paymentNotification = options => {
	const { gateway, gatewaySettings, req, res } = options;
	const params = req.body;
	const dataStr = Buffer.from(params.data, 'base64').toString();
	const data = JSON.parse(dataStr);

	res.status(200).end();

	const sign = getHashFromString(
		gatewaySettings.private_key + params.data + gatewaySettings.private_key
	);
	const signatureValid = sign === params.signature;
	const paymentSuccess = data.status === 'success';
	const orderId = data.order_id;

	if (signatureValid && paymentSuccess) {
		OrdersService.updateOrder(orderId, {
			paid: true,
			date_paid: new Date()
		}).then(() => {
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
};

const getForm = (params, private_key) => {
	params = getFormParams(params);
	let data = new Buffer(JSON.stringify(params)).toString('base64');
	let signature = getHashFromString(private_key + data + private_key);

	return {
		data: data,
		signature: signature
	};
};

const getFormParams = params => {
	if (!params.version) throw new Error('version is null');
	if (!params.amount) throw new Error('amount is null');
	if (!params.currency) throw new Error('currency is null');
	if (!params.description) throw new Error('description is null');

	return params;
};

const getHashFromString = str => {
	let sha1 = crypto.createHash('sha1');
	sha1.update(str);
	return sha1.digest('base64');
};

export default {
	getPaymentFormSettings: getPaymentFormSettings,
	paymentNotification: paymentNotification
};
