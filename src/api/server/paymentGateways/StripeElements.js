import stripePackage from 'stripe';
import OrdersService from '../services/orders/orders';
import OrdertTansactionsService from '../services/orders/orderTransactions';

const getPaymentFormSettings = options => {
	const { gateway, gatewaySettings, order, amount, currency } = options;
	const formSettings = {
		order_id: order.id,
		amount,
		currency,
		email: order.email,
		public_key: gatewaySettings.public_key
	};
	return Promise.resolve(formSettings);
};

const processOrderPayment = async ({ order, gatewaySettings, settings }) => {
	try {
		const stripe = stripePackage(gatewaySettings.secret_key);
		const charge = await stripe.charges.create({
			amount: order.grand_total * 100,
			currency: settings.currency_code,
			description: `Order #${order.number}`,
			statement_descriptor: `Order #${order.number}`,
			metadata: {
				order_id: order.id
			},
			source: order.payment_token
		});

		// status: succeeded, pending, failed
		const paymentSucceeded =
			charge.status === 'succeeded' || charge.paid === true;

		if (paymentSucceeded) {
			await OrdersService.updateOrder(order.id, {
				paid: true,
				date_paid: new Date()
			});
		}

		await OrdertTansactionsService.addTransaction(order.id, {
			transaction_id: charge.id,
			amount: charge.amount / 100,
			currency: charge.currency,
			status: charge.status,
			details: charge.outcome.seller_message,
			success: paymentSucceeded
		});

		return paymentSucceeded;
	} catch (err) {
		// handle errors
		return false;
	}
};

export default {
	getPaymentFormSettings,
	processOrderPayment
};
