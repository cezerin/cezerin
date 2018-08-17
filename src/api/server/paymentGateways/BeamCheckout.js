/* eslint-disable prettier/prettier */
import crypto from 'crypto';
import https from 'https';
import EthUtil from 'ethereumjs-util';
import _ from 'lodash';
import OrdersService from '../services/orders/orders';
import OrderTransactionsService from '../services/orders/orderTransactions';

async function generatePaymentSecret() {
	return new Promise((resolve, reject) => {
		crypto.randomBytes(32, (err, buf) => {
			if (err) {
				reject(err);
			}
			const hex = EthUtil.bufferToHex(buf);
			const bn = new EthUtil.BN(hex, 16);
			resolve(bn.toString());
		});
	});
}

async function getPaymentFormSettings(options) {
	const { gatewaySettings, order, amount, currency } = options;

	let secretCreationTransaction = _.find(order.transactions, {
		transaction_id: 'BEAM_SECRET'
	});

	if (!secretCreationTransaction) {
		const secret = await generatePaymentSecret();

		secretCreationTransaction = await OrderTransactionsService.addTransaction(
			order.id,
			{
				transaction_id: 'BEAM_SECRET',
				status: 'COMPLETED',
				details: secret
			}
		);
	}

	return {
		orderId: order.id,
		amount,
		currency,
		hubUrl: gatewaySettings.hub_url,
		merchantPublicKey: gatewaySettings.public_key,
		merchantPaymentSecret: EthUtil.addHexPrefix(
			EthUtil.bufferToHex(
				EthUtil.sha256(new EthUtil.BN(secretCreationTransaction.details))
			)
		)
	};
}

async function verifyHubReceipt(hubUrl, address, secret, amount) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			https.get(
				`${hubUrl}/api/v1/receipt/${address}?secretHash=${secret}`,
				{ Accept: 'application/json' },
				res => {
					if (res.statusCode !== 200) {
						// Problem!
					}

					const data = [];

					res.on('data', d => {
						data.push(d);
					});

					res.on('end', () => {
						const response = JSON.parse(data.join(''));

						if (response.err) return reject(response.err);

						const { receipt } = response;

						if (receipt.walletServerDelta > amount) return resolve(true);
						return resolve(false);
					});
				}
			);
		}, 1000);
	});
}

async function paymentNotification(options) {
	const { gatewaySettings, req, res } = options;
	const params = req.body;
	const orderId = params.custom;
	const paymentSubmitted = params.payment_status === 'Completed';

	if (!paymentSubmitted) return res.status(200).end();

	const order = await OrdersService.getSingleOrder(orderId);
	const secretCreationTx = _.find(order.transactions, {
		transaction_id: 'BEAM_SECRET'
	});

	if (!secretCreationTx)
		res.status(400).send('No secret for that transaction?');

	const paid = await verifyHubReceipt(
		gatewaySettings.hub_url,
		gatewaySettings.public_key,
		secretCreationTx.details,
		order.grand_total
	);

	if (paid) {
		await OrdersService.updateOrder(order.id, { paid: true });
		return res.status(200).end();
	}
	return res.status(500).end();
}

export default {
	getPaymentFormSettings,
	paymentNotification
};
