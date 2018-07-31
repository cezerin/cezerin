import { ObjectID } from 'mongodb';
import { db } from '../../lib/mongo';
import parse from '../../lib/parse';

class ProductVariantsService {
	constructor() {}

	getVariants(productId) {
		if (!ObjectID.isValid(productId)) {
			return Promise.reject('Invalid identifier');
		}

		let productObjectID = new ObjectID(productId);
		return db
			.collection('products')
			.findOne({ _id: productObjectID }, { fields: { variants: 1 } })
			.then(product => product.variants || []);
	}

	deleteVariant(productId, variantId) {
		if (!ObjectID.isValid(productId) || !ObjectID.isValid(variantId)) {
			return Promise.reject('Invalid identifier');
		}
		let productObjectID = new ObjectID(productId);
		let variantObjectID = new ObjectID(variantId);

		return db
			.collection('products')
			.updateOne(
				{
					_id: productObjectID
				},
				{
					$pull: {
						variants: {
							id: variantObjectID
						}
					}
				}
			)
			.then(res => this.getVariants(productId));
	}

	addVariant(productId, data) {
		if (!ObjectID.isValid(productId)) {
			return Promise.reject('Invalid identifier');
		}
		let productObjectID = new ObjectID(productId);

		const variantData = this.getValidDocumentForInsert(data);

		return db
			.collection('products')
			.updateOne({ _id: productObjectID }, { $push: { variants: variantData } })
			.then(res => this.getVariants(productId));
	}

	updateVariant(productId, variantId, data) {
		if (!ObjectID.isValid(productId) || !ObjectID.isValid(variantId)) {
			return Promise.reject('Invalid identifier');
		}
		let productObjectID = new ObjectID(productId);
		let variantObjectID = new ObjectID(variantId);

		const variantData = this.getValidDocumentForUpdate(data);

		return db
			.collection('products')
			.updateOne(
				{
					_id: productObjectID,
					'variants.id': variantObjectID
				},
				{ $set: variantData }
			)
			.then(res => this.getVariants(productId));
	}

	getValidDocumentForInsert(data) {
		let variant = {
			id: new ObjectID(),
			sku: parse.getString(data.sku),
			price: parse.getNumberIfPositive(data.price) || 0,
			stock_quantity: parse.getNumberIfPositive(data.stock_quantity) || 0,
			weight: parse.getNumberIfPositive(data.weight) || 0,
			options: []
		};

		return variant;
	}

	getValidDocumentForUpdate(data) {
		if (Object.keys(data).length === 0) {
			return new Error('Required fields are missing');
		}

		let variant = {};

		if (data.sku !== undefined) {
			variant['variants.$.sku'] = parse.getString(data.sku);
		}

		if (data.price !== undefined) {
			variant['variants.$.price'] = parse.getNumberIfPositive(data.price) || 0;
		}

		if (data.stock_quantity !== undefined) {
			variant['variants.$.stock_quantity'] =
				parse.getNumberIfPositive(data.stock_quantity) || 0;
		}

		if (data.weight !== undefined) {
			variant['variants.$.weight'] =
				parse.getNumberIfPositive(data.weight) || 0;
		}

		return variant;
	}

	getVariantOptions(productId, variantId) {
		let productObjectID = new ObjectID(productId);

		return db
			.collection('products')
			.findOne({ _id: productObjectID }, { fields: { variants: 1 } })
			.then(product => (product && product.variants ? product.variants : null))
			.then(
				variants =>
					variants && variants.length > 0
						? variants.find(variant => variant.id.toString() === variantId)
						: null
			)
			.then(
				variant =>
					variant && variant.options.length > 0 ? variant.options : []
			);
	}

	getModifiedVariantOptions(productId, variantId, optionId, valueId) {
		return this.getVariantOptions(productId, variantId).then(options => {
			if (options && options.length > 0) {
				const optionToChange = options.find(
					option => option.option_id.toString() === optionId
				);

				if (optionToChange === undefined) {
					// if option not exists => add new option
					options.push({
						option_id: new ObjectID(optionId),
						value_id: new ObjectID(valueId)
					});
				} else {
					// if option exists => set new valueId

					if (optionToChange.value_id.toString() === valueId) {
						// don't save same value
						return option;
					}

					options = options.map(option => {
						if (option.option_id.toString() === optionId) {
							option.value_id = new ObjectID(valueId);
							return option;
						} else {
							return option;
						}
					});
				}
			} else {
				options = [];
				options.push({
					option_id: new ObjectID(optionId),
					value_id: new ObjectID(valueId)
				});
			}

			return options;
		});
	}

	setVariantOption(productId, variantId, data) {
		if (
			!ObjectID.isValid(productId) ||
			!ObjectID.isValid(variantId) ||
			!ObjectID.isValid(data.option_id) ||
			!ObjectID.isValid(data.value_id)
		) {
			return Promise.reject('Invalid identifier');
		}
		let productObjectID = new ObjectID(productId);
		let variantObjectID = new ObjectID(variantId);

		return this.getModifiedVariantOptions(
			productId,
			variantId,
			data.option_id,
			data.value_id
		)
			.then(options =>
				db
					.collection('products')
					.updateOne(
						{ _id: productObjectID, 'variants.id': variantObjectID },
						{ $set: { 'variants.$.options': options } }
					)
			)
			.then(res => this.getVariants(productId));
	}
}

export default new ProductVariantsService();
