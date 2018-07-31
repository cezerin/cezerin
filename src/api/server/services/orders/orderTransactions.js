import { ObjectID } from 'mongodb';
import { db } from '../../lib/mongo';
import utils from '../../lib/utils';
import parse from '../../lib/parse';
import webhooks from '../../lib/webhooks';
import OrdersService from './orders';

class OrdertTansactionsService {
	constructor() {}

	async addTransaction(order_id, data) {
		if (!ObjectID.isValid(order_id)) {
			return Promise.reject('Invalid identifier');
		}
		let orderObjectID = new ObjectID(order_id);
		const transaction = this.getValidDocumentForInsert(data);

		await db.collection('orders').updateOne(
			{
				_id: orderObjectID
			},
			{
				$push: {
					transactions: transaction
				}
			}
		);

		const order = await OrdersService.getSingleOrder(order_id);
		await webhooks.trigger({
			event: webhooks.events.TRANSACTION_CREATED,
			payload: order
		});
		return order;
	}

	async updateTransaction(order_id, transaction_id, data) {
		if (!ObjectID.isValid(order_id) || !ObjectID.isValid(transaction_id)) {
			return Promise.reject('Invalid identifier');
		}
		let orderObjectID = new ObjectID(order_id);
		let transactionObjectID = new ObjectID(transaction_id);
		const transaction = this.getValidDocumentForUpdate(data);

		await db.collection('orders').updateOne(
			{
				_id: orderObjectID,
				'transactions.id': transactionObjectID
			},
			{
				$set: transaction
			}
		);

		const order = await OrdersService.getSingleOrder(order_id);
		await webhooks.trigger({
			event: webhooks.events.TRANSACTION_UPDATED,
			payload: order
		});
		return order;
	}

	async deleteTransaction(order_id, transaction_id) {
		if (!ObjectID.isValid(order_id) || !ObjectID.isValid(transaction_id)) {
			return Promise.reject('Invalid identifier');
		}
		let orderObjectID = new ObjectID(order_id);
		let transactionObjectID = new ObjectID(transaction_id);

		await db.collection('orders').updateOne(
			{
				_id: orderObjectID
			},
			{
				$pull: {
					transactions: {
						id: transactionObjectID
					}
				}
			}
		);

		const order = await OrdersService.getSingleOrder(order_id);
		await webhooks.trigger({
			event: webhooks.events.TRANSACTION_DELETED,
			payload: order
		});
		return order;
	}

	getValidDocumentForInsert(data) {
		return {
			id: new ObjectID(),
			transaction_id: parse.getString(data.transaction_id),
			amount: parse.getNumberIfPositive(data.amount) || 0,
			currency: parse.getString(data.currency),
			status: parse.getString(data.status),
			details: parse.getString(data.details),
			success: parse.getBooleanIfValid(data.success)
		};
	}

	getValidDocumentForUpdate(data) {
		if (Object.keys(data).length === 0) {
			return new Error('Required fields are missing');
		}

		let transaction = {};

		if (data.transaction_id !== undefined) {
			transaction['transactions.$.transaction_id'] = parse.getString(
				data.transaction_id
			);
		}

		if (data.amount !== undefined) {
			transaction['transactions.$.amount'] =
				parse.getNumberIfPositive(data.amount) || 0;
		}

		if (data.currency !== undefined) {
			transaction['transactions.$.currency'] = parse.getString(data.currency);
		}

		if (data.status !== undefined) {
			transaction['transactions.$.status'] = parse.getString(data.status);
		}

		if (data.details !== undefined) {
			transaction['transactions.$.details'] = parse.getString(data.details);
		}

		if (data.success !== undefined) {
			transaction['transactions.$.success'] = parse.getBooleanIfValid(
				data.success
			);
		}

		return transaction;
	}
}

export default new OrdertTansactionsService();
