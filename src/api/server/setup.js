const winston = require('winston');
const url = require('url');
const { MongoClient } = require('mongodb');
const logger = require('./lib/logger');
const settings = require('./lib/settings');

const mongodbConnection = settings.mongodbServerUrl;
const mongoPathName = url.parse(mongodbConnection).pathname;
const dbName = mongoPathName.substring(mongoPathName.lastIndexOf('/') + 1);

const CONNECT_OPTIONS = {
	useNewUrlParser: true
};

const DEFAULT_LANGUAGE = 'english';

const addPage = async (db, pageObject) => {
	const count = await db
		.collection('pages')
		.countDocuments({ slug: pageObject.slug });
	const docExists = +count > 0;
	if (!docExists) {
		winston.info(`Added page: /${pageObject.slug}`);
	}
};

const addAllPages = async db => {
	await addPage(db, {
		slug: '',
		meta_title: 'Home',
		enabled: true,
		is_system: true
	});
	await addPage(db, {
		slug: 'checkout',
		meta_title: 'Checkout',
		enabled: true,
		is_system: true
	});
	await addPage(db, {
		slug: 'checkout-success',
		meta_title: 'Thank You!',
		enabled: true,
		is_system: true
	});
};

const createIndex = (db, collectionName, fields, options) =>
	db.collection(collectionName).createIndex(fields, options);

const createAllIndexes = async db => {
	const pagesIndexes = await db
		.collection('pages')
		.listIndexes()
		.toArray();

	if (pagesIndexes.length === 1) {
		await createIndex(db, 'pages', { enabled: 1 });
		await createIndex(db, 'pages', { slug: 1 });
	}

	const productCategoriesIndexes = await db
		.collection('productCategories')
		.listIndexes()
		.toArray();

	if (productCategoriesIndexes.length === 1) {
		await createIndex(db, 'productCategories', { enabled: 1 });
		await createIndex(db, 'productCategories', { slug: 1 });
	}

	const productsIndexes = await db
		.collection('products')
		.listIndexes()
		.toArray();

	if (productsIndexes.length === 1) {
		await createIndex(db, 'products', { slug: 1 });
		await createIndex(db, 'products', { enabled: 1 });
		await createIndex(db, 'products', { category_id: 1 });
		await createIndex(db, 'products', { sku: 1 });
		await createIndex(db, 'products', {
			'attributes.name': 1,
			'attributes.value': 1
		});
		await createIndex(
			db,
			'products',
			{
				name: 'text',
				description: 'text'
			},
			{ default_language: DEFAULT_LANGUAGE, name: 'textIndex' }
		);
	}

	const customersIndexes = await db
		.collection('customers')
		.listIndexes()
		.toArray();

	if (customersIndexes.length === 1) {
		await createIndex(db, 'customers', { group_id: 1 });
		await createIndex(db, 'customers', { email: 1 });
		await createIndex(db, 'customers', { mobile: 1 });
		await createIndex(
			db,
			'customers',
			{
				full_name: 'text',
				'addresses.address1': 'text'
			},
			{ default_language: DEFAULT_LANGUAGE, name: 'textIndex' }
		);
	}

	const ordersIndexes = await db
		.collection('orders')
		.listIndexes()
		.toArray();

	if (ordersIndexes.length === 1) {
		await createIndex(db, 'orders', { draft: 1 });
		await createIndex(db, 'orders', { number: 1 });
		await createIndex(db, 'orders', { customer_id: 1 });
		await createIndex(db, 'orders', { email: 1 });
		await createIndex(db, 'orders', { mobile: 1 });
		await createIndex(
			db,
			'orders',
			{
				'shipping_address.full_name': 'text',
				'shipping_address.address1': 'text'
			},
			{ default_language: DEFAULT_LANGUAGE, name: 'textIndex' }
		);
	}
};

(async () => {
	let client = null;
	let db = null;

	try {
		client = await MongoClient.connect(
			mongodbConnection,
			CONNECT_OPTIONS
		);
		db = client.db(dbName);
		winston.info('1. MongoDB connected successfully');
	} catch (e) {
		winston.error(`MongoDB connection was failed. ${e.message}`);
		return;
	}

	await addAllPages(db);
	winston.info('2. Pages added');

	await createAllIndexes(db);
	winston.info('3. Indexes created');

	client.close();
})();
