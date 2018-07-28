import { ObjectID } from 'mongodb';
import path from 'path';
import url from 'url';
import fse from 'fs-extra';
import settings from '../../lib/settings';
import { db } from '../../lib/mongo';
import utils from '../../lib/utils';
import parse from '../../lib/parse';
import CategoriesService from './productCategories';
import SettingsService from '../settings/settings';

class ProductsService {
	constructor() {}

	async getProducts(params = {}) {
		const categories = await CategoriesService.getCategories({
			fields: 'parent_id'
		});
		const fieldsArray = this.getArrayFromCSV(params.fields);
		const limit = parse.getNumberIfPositive(params.limit) || 1000;
		const offset = parse.getNumberIfPositive(params.offset) || 0;
		const projectQuery = this.getProjectQuery(fieldsArray);
		const sortQuery = this.getSortQuery(params); // todo: validate every sort field
		const matchQuery = this.getMatchQuery(params, categories);
		const matchTextQuery = this.getMatchTextQuery(params);
		const itemsAggregation = [];

		// $match with $text is only allowed as the first pipeline stage"
		if (matchTextQuery) {
			itemsAggregation.push({ $match: matchTextQuery });
		}
		itemsAggregation.push({ $project: projectQuery });
		itemsAggregation.push({ $match: matchQuery });
		if (sortQuery) {
			itemsAggregation.push({ $sort: sortQuery });
		}
		itemsAggregation.push({ $skip: offset });
		itemsAggregation.push({ $limit: limit });
		itemsAggregation.push({
			$lookup: {
				from: 'productCategories',
				localField: 'category_id',
				foreignField: '_id',
				as: 'categories'
			}
		});
		itemsAggregation.push({
			$project: {
				'categories.description': 0,
				'categories.meta_description': 0,
				'categories._id': 0,
				'categories.date_created': 0,
				'categories.date_updated': 0,
				'categories.image': 0,
				'categories.meta_title': 0,
				'categories.enabled': 0,
				'categories.sort': 0,
				'categories.parent_id': 0,
				'categories.position': 0
			}
		});

		const [
			itemsResult,
			countResult,
			minMaxPriceResult,
			allAttributesResult,
			attributesResult,
			generalSettings
		] = await Promise.all([
			db
				.collection('products')
				.aggregate(itemsAggregation)
				.toArray(),
			this.getCountIfNeeded(params, matchQuery, matchTextQuery, projectQuery),
			this.getMinMaxPriceIfNeeded(
				params,
				categories,
				matchTextQuery,
				projectQuery
			),
			this.getAllAttributesIfNeeded(
				params,
				categories,
				matchTextQuery,
				projectQuery
			),
			this.getAttributesIfNeeded(
				params,
				categories,
				matchTextQuery,
				projectQuery
			),
			SettingsService.getSettings()
		]);

		const domain = generalSettings.domain || '';
		const ids = this.getArrayFromCSV(parse.getString(params.ids));
		const sku = this.getArrayFromCSV(parse.getString(params.sku));

		let items = itemsResult.map(item => this.changeProperties(item, domain));
		items = this.sortItemsByArrayOfIdsIfNeed(items, ids, sortQuery);
		items = this.sortItemsByArrayOfSkuIfNeed(items, sku, sortQuery);
		items = items.filter(item => !!item);

		let total_count = 0;
		let min_price = 0;
		let max_price = 0;

		if (countResult && countResult.length === 1) {
			total_count = countResult[0].count;
		}

		if (minMaxPriceResult && minMaxPriceResult.length === 1) {
			min_price = minMaxPriceResult[0].min_price || 0;
			max_price = minMaxPriceResult[0].max_price || 0;
		}

		let attributes = [];
		if (allAttributesResult) {
			attributes = this.getOrganizedAttributes(
				allAttributesResult,
				attributesResult,
				params
			);
		}

		return {
			price: {
				min: min_price,
				max: max_price
			},
			attributes: attributes,
			total_count: total_count,
			has_more: offset + items.length < total_count,
			data: items
		};
	}

	sortItemsByArrayOfIdsIfNeed(items, arrayOfIds, sortQuery) {
		return arrayOfIds &&
			arrayOfIds.length > 0 &&
			sortQuery === null &&
			items &&
			items.length > 0
			? arrayOfIds.map(id => items.find(item => item.id === id))
			: items;
	}

	sortItemsByArrayOfSkuIfNeed(items, arrayOfSku, sortQuery) {
		return arrayOfSku &&
			arrayOfSku.length > 0 &&
			sortQuery === null &&
			items &&
			items.length > 0
			? arrayOfSku.map(sku => items.find(item => item.sku === sku))
			: items;
	}

	getOrganizedAttributes(
		allAttributesResult,
		filteredAttributesResult,
		params
	) {
		const uniqueAttributesName = [
			...new Set(allAttributesResult.map(a => a._id.name))
		];

		return uniqueAttributesName.sort().map(attributeName => ({
			name: attributeName,
			values: allAttributesResult
				.filter(b => b._id.name === attributeName)
				.sort(
					(a, b) =>
						a._id.value > b._id.value ? 1 : b._id.value > a._id.value ? -1 : 0
				)
				.map(b => ({
					name: b._id.value,
					checked:
						params[`attributes.${b._id.name}`] &&
						params[`attributes.${b._id.name}`].includes(b._id.value)
							? true
							: false,
					// total: b.count,
					count: this.getAttributeCount(
						filteredAttributesResult,
						b._id.name,
						b._id.value
					)
				}))
		}));
	}

	getAttributeCount(attributesArray, attributeName, attributeValue) {
		const attribute = attributesArray.find(
			a => a._id.name === attributeName && a._id.value === attributeValue
		);
		return attribute ? attribute.count : 0;
	}

	getCountIfNeeded(params, matchQuery, matchTextQuery, projectQuery) {
		// get total count
		// not for product details or ids
		if (!params.ids) {
			const aggregation = [];
			if (matchTextQuery) {
				aggregation.push({ $match: matchTextQuery });
			}
			aggregation.push({ $project: projectQuery });
			aggregation.push({ $match: matchQuery });
			aggregation.push({ $group: { _id: null, count: { $sum: 1 } } });
			return db
				.collection('products')
				.aggregate(aggregation)
				.toArray();
		} else {
			return null;
		}
	}

	getMinMaxPriceIfNeeded(params, categories, matchTextQuery, projectQuery) {
		// get min max price without filter by price
		// not for product details or ids
		if (!params.ids) {
			const minMaxPriceMatchQuery = this.getMatchQuery(
				params,
				categories,
				false,
				false
			);

			const aggregation = [];
			if (matchTextQuery) {
				aggregation.push({ $match: matchTextQuery });
			}
			aggregation.push({ $project: projectQuery });
			aggregation.push({ $match: minMaxPriceMatchQuery });
			aggregation.push({
				$group: {
					_id: null,
					min_price: { $min: '$price' },
					max_price: { $max: '$price' }
				}
			});
			return db
				.collection('products')
				.aggregate(aggregation)
				.toArray();
		} else {
			return null;
		}
	}

	getAllAttributesIfNeeded(params, categories, matchTextQuery, projectQuery) {
		// get attributes with counts without filter by attributes
		// only for category
		if (params.category_id) {
			const attributesMatchQuery = this.getMatchQuery(
				params,
				categories,
				false,
				false
			);

			const aggregation = [];
			if (matchTextQuery) {
				aggregation.push({ $match: matchTextQuery });
			}
			aggregation.push({ $project: projectQuery });
			aggregation.push({ $match: attributesMatchQuery });
			aggregation.push({ $unwind: '$attributes' });
			aggregation.push({ $group: { _id: '$attributes', count: { $sum: 1 } } });
			return db
				.collection('products')
				.aggregate(aggregation)
				.toArray();
		} else {
			return null;
		}
	}

	getAttributesIfNeeded(params, categories, matchTextQuery, projectQuery) {
		// get attributes with counts without filter by attributes
		// only for category
		if (params.category_id) {
			const attributesMatchQuery = this.getMatchQuery(
				params,
				categories,
				false,
				true
			);

			const aggregation = [];
			if (matchTextQuery) {
				aggregation.push({ $match: matchTextQuery });
			}
			aggregation.push({ $project: projectQuery });
			aggregation.push({ $match: attributesMatchQuery });
			aggregation.push({ $unwind: '$attributes' });
			aggregation.push({ $group: { _id: '$attributes', count: { $sum: 1 } } });
			return db
				.collection('products')
				.aggregate(aggregation)
				.toArray();
		} else {
			return null;
		}
	}

	getSortQuery({ sort, search }) {
		const isSearchUsed =
			search &&
			search.length > 0 &&
			search !== 'null' &&
			search !== 'undefined';
		if (sort === 'search' && isSearchUsed) {
			return { score: { $meta: 'textScore' } };
		} else if (sort && sort.length > 0) {
			const fields = sort.split(',');
			return Object.assign(
				...fields.map(field => ({
					[field.startsWith('-') ? field.slice(1) : field]: field.startsWith(
						'-'
					)
						? -1
						: 1
				}))
			);
		} else {
			return null;
		}
	}

	getProjectQuery(fieldsArray) {
		let salePrice = '$sale_price';
		let regularPrice = '$regular_price';
		let costPrice = '$cost_price';

		let project = {
			category_ids: 1,
			related_product_ids: 1,
			enabled: 1,
			discontinued: 1,
			date_created: 1,
			date_updated: 1,
			cost_price: costPrice,
			regular_price: regularPrice,
			sale_price: salePrice,
			date_sale_from: 1,
			date_sale_to: 1,
			images: 1,
			prices: 1,
			quantity_inc: 1,
			quantity_min: 1,
			meta_description: 1,
			meta_title: 1,
			name: 1,
			description: 1,
			sku: 1,
			code: 1,
			tax_class: 1,
			position: 1,
			tags: 1,
			options: 1,
			variants: 1,
			weight: 1,
			dimensions: 1,
			attributes: 1,
			date_stock_expected: 1,
			stock_tracking: 1,
			stock_preorder: 1,
			stock_backorder: 1,
			stock_quantity: 1,
			on_sale: {
				$and: [
					{
						$lt: [new Date(), '$date_sale_to']
					},
					{
						$gt: [new Date(), '$date_sale_from']
					}
				]
			},
			variable: {
				$gt: [
					{
						$size: { $ifNull: ['$variants', []] }
					},
					0
				]
			},
			price: {
				$cond: {
					if: {
						$and: [
							{
								$lt: [new Date(), '$date_sale_to']
							},
							{
								$gt: [new Date(), '$date_sale_from']
							},
							{
								$gt: ['$sale_price', 0]
							}
						]
					},
					then: salePrice,
					else: regularPrice
				}
			},
			stock_status: {
				$cond: {
					if: {
						$eq: ['$discontinued', true]
					},
					then: 'discontinued',
					else: {
						$cond: {
							if: {
								$gt: ['$stock_quantity', 0]
							},
							then: 'available',
							else: {
								$cond: {
									if: {
										$eq: ['$stock_backorder', true]
									},
									then: 'backorder',
									else: {
										$cond: {
											if: {
												$eq: ['$stock_preorder', true]
											},
											then: 'preorder',
											else: 'out_of_stock'
										}
									}
								}
							}
						}
					}
				}
			},
			url: { $literal: '' },
			path: { $literal: '' },
			category_name: { $literal: '' },
			category_slug: { $literal: '' }
		};

		if (fieldsArray && fieldsArray.length > 0) {
			project = this.getProjectFilteredByFields(project, fieldsArray);
		}

		// required fields
		project._id = 0;
		project.id = '$_id';
		project.category_id = 1;
		project.slug = 1;

		return project;
	}

	getArrayFromCSV(fields) {
		return fields && fields.length > 0 ? fields.split(',') : [];
	}

	getProjectFilteredByFields(project, fieldsArray) {
		return Object.assign(...fieldsArray.map(key => ({ [key]: project[key] })));
	}

	getMatchTextQuery({ search }) {
		if (
			search &&
			search.length > 0 &&
			search !== 'null' &&
			search !== 'undefined'
		) {
			return {
				$or: [{ sku: new RegExp(search, 'i') }, { $text: { $search: search } }]
			};
		} else {
			return null;
		}
	}

	getMatchAttributesQuery(params) {
		let attributesArray = Object.keys(params)
			.filter(paramName => paramName.startsWith('attributes.'))
			.map(paramName => {
				const paramValue = params[paramName];
				const paramValueArray = Array.isArray(paramValue)
					? paramValue
					: [paramValue];

				return {
					name: paramName.replace('attributes.', ''),
					values: paramValueArray
				};
			});

		return attributesArray;
	}

	getMatchQuery(params, categories, useAttributes = true, usePrice = true) {
		let {
			category_id,
			enabled,
			discontinued,
			on_sale,
			stock_status,
			price_from,
			price_to,
			sku,
			ids,
			tags
		} = params;

		// parse values
		category_id = parse.getObjectIDIfValid(category_id);
		enabled = parse.getBooleanIfValid(enabled);
		discontinued = parse.getBooleanIfValid(discontinued);
		on_sale = parse.getBooleanIfValid(on_sale);
		price_from = parse.getNumberIfPositive(price_from);
		price_to = parse.getNumberIfPositive(price_to);
		ids = parse.getString(ids);
		tags = parse.getString(tags);

		let queries = [];
		const currentDate = new Date();

		if (category_id !== null) {
			let categoryChildren = [];
			CategoriesService.findAllChildren(
				categories,
				category_id,
				categoryChildren
			);
			queries.push({
				$or: [
					{
						category_id: { $in: categoryChildren }
					},
					{
						category_ids: category_id
					}
				]
			});
		}

		if (enabled !== null) {
			queries.push({
				enabled: enabled
			});
		}

		if (discontinued !== null) {
			queries.push({
				discontinued: discontinued
			});
		}

		if (on_sale !== null) {
			queries.push({
				on_sale: on_sale
			});
		}

		if (usePrice) {
			if (price_from !== null && price_from > 0) {
				queries.push({
					price: { $gte: price_from }
				});
			}

			if (price_to !== null && price_to > 0) {
				queries.push({
					price: { $lte: price_to }
				});
			}
		}

		if (stock_status && stock_status.length > 0) {
			queries.push({
				stock_status: stock_status
			});
		}

		if (ids && ids.length > 0) {
			const idsArray = ids.split(',');
			let objectIDs = [];
			for (const id of idsArray) {
				if (ObjectID.isValid(id)) {
					objectIDs.push(new ObjectID(id));
				}
			}
			queries.push({
				id: { $in: objectIDs }
			});
		}

		if (sku && sku.length > 0) {
			if (sku.includes(',')) {
				// multiple values
				const skus = sku.split(',');
				queries.push({
					sku: { $in: skus }
				});
			} else {
				// single value
				queries.push({
					sku: sku
				});
			}
		}

		if (tags && tags.length > 0) {
			queries.push({
				tags: tags
			});
		}

		if (useAttributes) {
			const attributesArray = this.getMatchAttributesQuery(params);
			if (attributesArray && attributesArray.length > 0) {
				const matchesArray = attributesArray.map(attribute => ({
					$elemMatch: { name: attribute.name, value: { $in: attribute.values } }
				}));
				queries.push({
					attributes: { $all: matchesArray }
				});
			}
		}

		let matchQuery = {};
		if (queries.length === 1) {
			matchQuery = queries[0];
		} else if (queries.length > 1) {
			matchQuery = {
				$and: queries
			};
		}

		return matchQuery;
	}

	getSingleProduct(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		return this.getProducts({ ids: id, limit: 1 }).then(
			products => (products.data.length > 0 ? products.data[0] : {})
		);
	}

	addProduct(data) {
		return this.getValidDocumentForInsert(data)
			.then(dataToInsert =>
				db.collection('products').insertMany([dataToInsert])
			)
			.then(res => this.getSingleProduct(res.ops[0]._id.toString()));
	}

	updateProduct(id, data) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const productObjectID = new ObjectID(id);

		return this.getValidDocumentForUpdate(id, data)
			.then(dataToSet =>
				db
					.collection('products')
					.updateOne({ _id: productObjectID }, { $set: dataToSet })
			)
			.then(res => (res.modifiedCount > 0 ? this.getSingleProduct(id) : null));
	}

	deleteProduct(productId) {
		if (!ObjectID.isValid(productId)) {
			return Promise.reject('Invalid identifier');
		}
		const productObjectID = new ObjectID(productId);
		// 1. delete Product
		return db
			.collection('products')
			.deleteOne({ _id: productObjectID })
			.then(deleteResponse => {
				if (deleteResponse.deletedCount > 0) {
					// 2. delete directory with images
					let deleteDir = path.resolve(
						settings.productsUploadPath + '/' + productId
					);
					fse.remove(deleteDir, err => {});
				}
				return deleteResponse.deletedCount > 0;
			});
	}

	getValidDocumentForInsert(data) {
		//  Allow empty product to create draft

		let product = {
			date_created: new Date(),
			date_updated: null,
			images: [],
			dimensions: {
				length: 0,
				width: 0,
				height: 0
			}
		};

		product.name = parse.getString(data.name);
		product.description = parse.getString(data.description);
		product.meta_description = parse.getString(data.meta_description);
		product.meta_title = parse.getString(data.meta_title);
		product.tags = parse.getArrayIfValid(data.tags) || [];
		product.attributes = this.getValidAttributesArray(data.attributes);
		product.enabled = parse.getBooleanIfValid(data.enabled, true);
		product.discontinued = parse.getBooleanIfValid(data.discontinued, false);
		product.slug = parse.getString(data.slug);
		product.sku = parse.getString(data.sku);
		product.code = parse.getString(data.code);
		product.tax_class = parse.getString(data.tax_class);
		product.related_product_ids = this.getArrayOfObjectID(
			data.related_product_ids
		);
		product.prices = parse.getArrayIfValid(data.prices) || [];
		product.cost_price = parse.getNumberIfPositive(data.cost_price) || 0;
		product.regular_price = parse.getNumberIfPositive(data.regular_price) || 0;
		product.sale_price = parse.getNumberIfPositive(data.sale_price) || 0;
		product.quantity_inc = parse.getNumberIfPositive(data.quantity_inc) || 1;
		product.quantity_min = parse.getNumberIfPositive(data.quantity_min) || 1;
		product.weight = parse.getNumberIfPositive(data.weight) || 0;
		product.stock_quantity =
			parse.getNumberIfPositive(data.stock_quantity) || 0;
		product.position = parse.getNumberIfValid(data.position);
		product.date_stock_expected = parse.getDateIfValid(
			data.date_stock_expected
		);
		product.date_sale_from = parse.getDateIfValid(data.date_sale_from);
		product.date_sale_to = parse.getDateIfValid(data.date_sale_to);
		product.stock_tracking = parse.getBooleanIfValid(
			data.stock_tracking,
			false
		);
		product.stock_preorder = parse.getBooleanIfValid(
			data.stock_preorder,
			false
		);
		product.stock_backorder = parse.getBooleanIfValid(
			data.stock_backorder,
			false
		);
		product.category_id = parse.getObjectIDIfValid(data.category_id);
		product.category_ids = parse.getArrayOfObjectID(data.category_ids);

		if (data.dimensions) {
			product.dimensions = data.dimensions;
		}

		if (product.slug.length === 0) {
			product.slug = product.name;
		}

		return this.setAvailableSlug(product).then(product =>
			this.setAvailableSku(product)
		);
	}

	getValidDocumentForUpdate(id, data) {
		if (Object.keys(data).length === 0) {
			throw new Error('Required fields are missing');
		}

		let product = {
			date_updated: new Date()
		};

		if (data.name !== undefined) {
			product.name = parse.getString(data.name);
		}

		if (data.description !== undefined) {
			product.description = parse.getString(data.description);
		}

		if (data.meta_description !== undefined) {
			product.meta_description = parse.getString(data.meta_description);
		}

		if (data.meta_title !== undefined) {
			product.meta_title = parse.getString(data.meta_title);
		}

		if (data.tags !== undefined) {
			product.tags = parse.getArrayIfValid(data.tags) || [];
		}

		if (data.attributes !== undefined) {
			product.attributes = this.getValidAttributesArray(data.attributes);
		}

		if (data.dimensions !== undefined) {
			product.dimensions = data.dimensions;
		}

		if (data.enabled !== undefined) {
			product.enabled = parse.getBooleanIfValid(data.enabled, true);
		}

		if (data.discontinued !== undefined) {
			product.discontinued = parse.getBooleanIfValid(data.discontinued, false);
		}

		if (data.slug !== undefined) {
			if (data.slug === '' && product.name && product.name.length > 0) {
				product.slug = product.name;
			} else {
				product.slug = parse.getString(data.slug);
			}
		}

		if (data.sku !== undefined) {
			product.sku = parse.getString(data.sku);
		}

		if (data.code !== undefined) {
			product.code = parse.getString(data.code);
		}

		if (data.tax_class !== undefined) {
			product.tax_class = parse.getString(data.tax_class);
		}

		if (data.related_product_ids !== undefined) {
			product.related_product_ids = this.getArrayOfObjectID(
				data.related_product_ids
			);
		}

		if (data.prices !== undefined) {
			product.prices = parse.getArrayIfValid(data.prices) || [];
		}

		if (data.cost_price !== undefined) {
			product.cost_price = parse.getNumberIfPositive(data.cost_price) || 0;
		}

		if (data.regular_price !== undefined) {
			product.regular_price =
				parse.getNumberIfPositive(data.regular_price) || 0;
		}

		if (data.sale_price !== undefined) {
			product.sale_price = parse.getNumberIfPositive(data.sale_price) || 0;
		}

		if (data.quantity_inc !== undefined) {
			product.quantity_inc = parse.getNumberIfPositive(data.quantity_inc) || 1;
		}

		if (data.quantity_min !== undefined) {
			product.quantity_min = parse.getNumberIfPositive(data.quantity_min) || 1;
		}

		if (data.weight !== undefined) {
			product.weight = parse.getNumberIfPositive(data.weight) || 0;
		}

		if (data.stock_quantity !== undefined) {
			product.stock_quantity =
				parse.getNumberIfPositive(data.stock_quantity) || 0;
		}

		if (data.position !== undefined) {
			product.position = parse.getNumberIfValid(data.position);
		}

		if (data.date_stock_expected !== undefined) {
			product.date_stock_expected = parse.getDateIfValid(
				data.date_stock_expected
			);
		}

		if (data.date_sale_from !== undefined) {
			product.date_sale_from = parse.getDateIfValid(data.date_sale_from);
		}

		if (data.date_sale_to !== undefined) {
			product.date_sale_to = parse.getDateIfValid(data.date_sale_to);
		}

		if (data.stock_tracking !== undefined) {
			product.stock_tracking = parse.getBooleanIfValid(
				data.stock_tracking,
				false
			);
		}

		if (data.stock_preorder !== undefined) {
			product.stock_preorder = parse.getBooleanIfValid(
				data.stock_preorder,
				false
			);
		}

		if (data.stock_backorder !== undefined) {
			product.stock_backorder = parse.getBooleanIfValid(
				data.stock_backorder,
				false
			);
		}

		if (data.category_id !== undefined) {
			product.category_id = parse.getObjectIDIfValid(data.category_id);
		}

		if (data.category_ids !== undefined) {
			product.category_ids = parse.getArrayOfObjectID(data.category_ids);
		}

		return this.setAvailableSlug(product, id).then(product =>
			this.setAvailableSku(product, id)
		);
	}

	getArrayOfObjectID(array) {
		if (array && Array.isArray(array)) {
			return array.map(item => parse.getObjectIDIfValid(item));
		} else {
			return [];
		}
	}

	getValidAttributesArray(attributes) {
		if (attributes && Array.isArray(attributes)) {
			return attributes
				.filter(
					item =>
						item.name && item.name !== '' && item.value && item.value !== ''
				)
				.map(item => ({
					name: parse.getString(item.name),
					value: parse.getString(item.value)
				}));
		} else {
			return [];
		}
	}

	getSortedImagesWithUrls(item, domain) {
		if (item.images && item.images.length > 0) {
			return item.images
				.map(image => {
					image.url = this.getImageUrl(domain, item.id, image.filename || '');
					return image;
				})
				.sort((a, b) => a.position - b.position);
		} else {
			return item.images;
		}
	}

	getImageUrl(domain, productId, imageFileName) {
		return url.resolve(
			domain,
			`${settings.productsUploadUrl}/${productId}/${imageFileName}`
		);
	}

	changeProperties(item, domain) {
		if (item) {
			if (item.id) {
				item.id = item.id.toString();
			}

			item.images = this.getSortedImagesWithUrls(item, domain);

			if (item.category_id) {
				item.category_id = item.category_id.toString();

				if (item.categories && item.categories.length > 0) {
					const category = item.categories[0];
					if (category) {
						if (item.category_name === '') {
							item.category_name = category.name;
						}

						if (item.category_slug === '') {
							item.category_slug = category.slug;
						}

						const categorySlug = category.slug || '';
						const productSlug = item.slug || '';

						if (item.url === '') {
							item.url = url.resolve(domain, `/${categorySlug}/${productSlug}`);
						}

						if (item.path === '') {
							item.path = `/${categorySlug}/${productSlug}`;
						}
					}
				}
			}
			item.categories = undefined;
		}

		return item;
	}

	isSkuExists(sku, productId) {
		let filter = {
			sku: sku
		};

		if (productId && ObjectID.isValid(productId)) {
			filter._id = { $ne: new ObjectID(productId) };
		}

		return db
			.collection('products')
			.count(filter)
			.then(count => count > 0);
	}

	setAvailableSku(product, productId) {
		// SKU can be empty
		if (product.sku && product.sku.length > 0) {
			let newSku = product.sku;
			let filter = {};
			if (productId && ObjectID.isValid(productId)) {
				filter._id = { $ne: new ObjectID(productId) };
			}

			return db
				.collection('products')
				.find(filter)
				.project({ sku: 1 })
				.toArray()
				.then(products => {
					while (products.find(p => p.sku === newSku)) {
						newSku += '-2';
					}
					product.sku = newSku;
					return product;
				});
		} else {
			return Promise.resolve(product);
		}
	}

	isSlugExists(slug, productId) {
		let filter = {
			slug: utils.cleanSlug(slug)
		};

		if (productId && ObjectID.isValid(productId)) {
			filter._id = { $ne: new ObjectID(productId) };
		}

		return db
			.collection('products')
			.count(filter)
			.then(count => count > 0);
	}

	setAvailableSlug(product, productId) {
		if (product.slug && product.slug.length > 0) {
			let newSlug = utils.cleanSlug(product.slug);
			let filter = {};
			if (productId && ObjectID.isValid(productId)) {
				filter._id = { $ne: new ObjectID(productId) };
			}

			return db
				.collection('products')
				.find(filter)
				.project({ slug: 1 })
				.toArray()
				.then(products => {
					while (products.find(p => p.slug === newSlug)) {
						newSlug += '-2';
					}
					product.slug = newSlug;
					return product;
				});
		} else {
			return Promise.resolve(product);
		}
	}
}

export default new ProductsService();
