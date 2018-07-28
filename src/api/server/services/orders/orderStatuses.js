import { ObjectID } from 'mongodb';
import { db } from '../../lib/mongo';
import utils from '../../lib/utils';
import parse from '../../lib/parse';

class OrderStatusesService {
	constructor() {}

	getStatuses(params = {}) {
		let filter = {};
		const id = parse.getObjectIDIfValid(params.id);
		if (id) {
			filter._id = new ObjectID(id);
		}

		return db
			.collection('orderStatuses')
			.find(filter)
			.toArray()
			.then(items => items.map(item => this.changeProperties(item)));
	}

	getSingleStatus(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		return this.getStatuses({ id: id }).then(statuses => {
			return statuses.length > 0 ? statuses[0] : null;
		});
	}

	addStatus(data) {
		const status = this.getValidDocumentForInsert(data);
		return db
			.collection('orderStatuses')
			.insertMany([status])
			.then(res => this.getSingleStatus(res.ops[0]._id.toString()));
	}

	updateStatus(id, data) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const statusObjectID = new ObjectID(id);
		const status = this.getValidDocumentForUpdate(id, data);

		return db
			.collection('orderStatuses')
			.updateOne(
				{
					_id: statusObjectID
				},
				{ $set: status }
			)
			.then(res => this.getSingleStatus(id));
	}

	deleteStatus(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const statusObjectID = new ObjectID(id);
		return db
			.collection('orderStatuses')
			.deleteOne({ _id: statusObjectID })
			.then(deleteResponse => {
				return deleteResponse.deletedCount > 0;
			});
	}

	getValidDocumentForInsert(data) {
		let status = {};

		status.name = parse.getString(data.name);
		status.description = parse.getString(data.description);
		status.color = parse.getString(data.color);
		status.bgcolor = parse.getString(data.bgcolor);
		status.is_public = parse.getBooleanIfValid(data.is_public, false);

		return status;
	}

	getValidDocumentForUpdate(id, data) {
		if (Object.keys(data).length === 0) {
			return new Error('Required fields are missing');
		}

		let status = {};

		if (data.name !== undefined) {
			status.name = parse.getString(data.name);
		}

		if (data.description !== undefined) {
			status.description = parse.getString(data.description);
		}

		if (data.color !== undefined) {
			status.color = parse.getString(data.color);
		}

		if (data.bgcolor !== undefined) {
			status.bgcolor = parse.getString(data.bgcolor);
		}

		if (data.is_public !== undefined) {
			status.is_public = parse.getBooleanIfValid(data.is_public, false);
		}

		return status;
	}

	changeProperties(item) {
		if (item) {
			item.id = item._id.toString();
			delete item._id;
		}

		return item;
	}
}

export default new OrderStatusesService();
