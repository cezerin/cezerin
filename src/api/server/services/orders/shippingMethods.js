import { ObjectID } from 'mongodb';
import { db } from '../../lib/mongo';
import utils from '../../lib/utils';
import parse from '../../lib/parse';
import ShippingMethodsLightService from './shippingMethodsLight';
import PaymentMethodsService from './paymentMethods';
import OrdersService from './orders';

class ShippingMethodsService {
	constructor() {}

	getFilter(params = {}) {
		return new Promise((resolve, reject) => {
			let filter = {};
			const id = parse.getObjectIDIfValid(params.id);
			const enabled = parse.getBooleanIfValid(params.enabled);

			if (id) {
				filter._id = new ObjectID(id);
			}

			if (enabled !== null) {
				filter.enabled = enabled;
			}

			const order_id = parse.getObjectIDIfValid(params.order_id);
			if (order_id) {
				return OrdersService.getSingleOrder(order_id).then(order => {
					if (order) {
						filter['$and'] = [];
						filter['$and'].push({
							$or: [
								{
									'conditions.weight_total_min': 0
								},
								{
									'conditions.weight_total_min': {
										$lte: order.weight_total
									}
								}
							]
						});
						filter['$and'].push({
							$or: [
								{
									'conditions.weight_total_max': 0
								},
								{
									'conditions.weight_total_max': {
										$gte: order.weight_total
									}
								}
							]
						});

						filter['$and'].push({
							$or: [
								{
									'conditions.subtotal_min': 0
								},
								{
									'conditions.subtotal_min': {
										$lte: order.subtotal
									}
								}
							]
						});
						filter['$and'].push({
							$or: [
								{
									'conditions.subtotal_max': 0
								},
								{
									'conditions.subtotal_max': {
										$gte: order.subtotal
									}
								}
							]
						});

						if (
							order.shipping_address.country &&
							order.shipping_address.country.length > 0
						) {
							filter['$and'].push({
								$or: [
									{
										'conditions.countries': {
											$size: 0
										}
									},
									{
										'conditions.countries': order.shipping_address.country
									}
								]
							});
						}

						if (
							order.shipping_address.state &&
							order.shipping_address.state.length > 0
						) {
							filter['$and'].push({
								$or: [
									{
										'conditions.states': {
											$size: 0
										}
									},
									{
										'conditions.states': order.shipping_address.state
									}
								]
							});
						}

						if (
							order.shipping_address.city &&
							order.shipping_address.city.length > 0
						) {
							filter['$and'].push({
								$or: [
									{
										'conditions.cities': {
											$size: 0
										}
									},
									{
										'conditions.cities': order.shipping_address.city
									}
								]
							});
						}
					}
					resolve(filter);
				});
			} else {
				resolve(filter);
			}
		});
	}

	getMethods(params = {}) {
		return this.getFilter(params).then(filter => {
			return ShippingMethodsLightService.getMethods(filter);
		});
	}

	getSingleMethod(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		return this.getMethods({ id: id }).then(methods => {
			return methods.length > 0 ? methods[0] : null;
		});
	}

	addMethod(data) {
		const method = this.getValidDocumentForInsert(data);
		return db
			.collection('shippingMethods')
			.insertMany([method])
			.then(res => this.getSingleMethod(res.ops[0]._id.toString()));
	}

	updateMethod(id, data) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const methodObjectID = new ObjectID(id);
		const method = this.getValidDocumentForUpdate(id, data);

		return db
			.collection('shippingMethods')
			.updateOne(
				{
					_id: methodObjectID
				},
				{ $set: method }
			)
			.then(res => this.getSingleMethod(id));
	}

	async deleteMethod(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const methodObjectID = new ObjectID(id);
		const deleteResponse = await db
			.collection('shippingMethods')
			.deleteOne({ _id: methodObjectID });

		await PaymentMethodsService.pullShippingMethod(id);
		return deleteResponse.deletedCount > 0;
	}

	getShippingMethodConditions(conditions) {
		return conditions
			? {
					countries: parse.getArrayIfValid(conditions.countries) || [],
					states: parse.getArrayIfValid(conditions.states) || [],
					cities: parse.getArrayIfValid(conditions.cities) || [],
					subtotal_min: parse.getNumberIfPositive(conditions.subtotal_min) || 0,
					subtotal_max: parse.getNumberIfPositive(conditions.subtotal_max) || 0,
					weight_total_min:
						parse.getNumberIfPositive(conditions.weight_total_min) || 0,
					weight_total_max:
						parse.getNumberIfPositive(conditions.weight_total_max) || 0
			  }
			: {
					countries: [],
					states: [],
					cities: [],
					subtotal_min: 0,
					subtotal_max: 0,
					weight_total_min: 0,
					weight_total_max: 0
			  };
	}

	getFields(fields) {
		if (fields && Array.isArray(fields) && fields.length > 0) {
			return fields.map(field => ({
				key: parse.getString(field.key),
				label: parse.getString(field.label),
				required: parse.getBooleanIfValid(field.required, false)
			}));
		} else {
			return [];
		}
	}

	getValidDocumentForInsert(data) {
		let method = {
			// 'logo': '',
			// 'app_id': null,
			// 'app_settings': {}
		};

		method.name = parse.getString(data.name);
		method.description = parse.getString(data.description);
		method.position = parse.getNumberIfPositive(data.position) || 0;
		method.enabled = parse.getBooleanIfValid(data.enabled, true);
		method.price = parse.getNumberIfPositive(data.price) || 0;
		method.conditions = this.getShippingMethodConditions(data.conditions);
		method.fields = this.getFields(data.fields);

		return method;
	}

	getValidDocumentForUpdate(id, data) {
		if (Object.keys(data).length === 0) {
			return new Error('Required fields are missing');
		}

		let method = {};

		if (data.name !== undefined) {
			method.name = parse.getString(data.name);
		}

		if (data.description !== undefined) {
			method.description = parse.getString(data.description);
		}

		if (data.position !== undefined) {
			method.position = parse.getNumberIfPositive(data.position) || 0;
		}

		if (data.enabled !== undefined) {
			method.enabled = parse.getBooleanIfValid(data.enabled, true);
		}

		if (data.price !== undefined) {
			method.price = parse.getNumberIfPositive(data.price) || 0;
		}

		if (data.conditions !== undefined) {
			method.conditions = this.getShippingMethodConditions(data.conditions);
		}

		if (data.fields !== undefined) {
			method.fields = this.getFields(data.fields);
		}

		return method;
	}
}

export default new ShippingMethodsService();
