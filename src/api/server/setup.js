import winston from 'winston';
import url from 'url';
import { MongoClient } from 'mongodb';
import logger from './lib/logger';
import settings from './lib/settings';

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
		await db.collection('pages').insertOne(pageObject);
		winston.info(`- Added page: /${pageObject.slug}`);
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
	await addPage(db, {
		slug: 'about',
		meta_title: 'About us',
		enabled: true,
		is_system: false
	});
};

const addAllProducts = async db => {
	const productCategoriesCount = await db
		.collection('productCategories')
		.countDocuments({});

	const productsCount = await db.collection('products').countDocuments({});

	const productsNotExists = productCategoriesCount === 0 && productsCount === 0;

	if (productsNotExists) {
		const catA = await db.collection('productCategories').insertOne({
			name: 'Category A',
			slug: 'category-a',
			image: '',
			parent_id: null,
			enabled: true
		});

		const catB = await db.collection('productCategories').insertOne({
			name: 'Category B',
			slug: 'category-b',
			image: '',
			parent_id: null,
			enabled: true
		});

		const catC = await db.collection('productCategories').insertOne({
			name: 'Category C',
			slug: 'category-c',
			image: '',
			parent_id: null,
			enabled: true
		});

		const catA1 = await db.collection('productCategories').insertOne({
			name: 'Subcategory 1',
			slug: 'category-a-1',
			image: '',
			parent_id: catA.insertedId,
			enabled: true
		});

		const catA2 = await db.collection('productCategories').insertOne({
			name: 'Subcategory 2',
			slug: 'category-a-2',
			image: '',
			parent_id: catA.insertedId,
			enabled: true
		});

		const catA3 = await db.collection('productCategories').insertOne({
			name: 'Subcategory 3',
			slug: 'category-a-3',
			image: '',
			parent_id: catA.insertedId,
			enabled: true
		});

		await db.collection('products').insertOne({
			name: 'Product A',
			slug: 'product-a',
			category_id: catA.insertedId,
			regular_price: 950,
			stock_quantity: 1,
			enabled: true,
			discontinued: false,
			attributes: [
				{ name: 'Brand', value: 'Brand A' },
				{ name: 'Size', value: 'M' }
			]
		});

		await db.collection('products').insertOne({
			name: 'Product B',
			slug: 'product-b',
			category_id: catA.insertedId,
			regular_price: 1250,
			stock_quantity: 1,
			enabled: true,
			discontinued: false,
			attributes: [
				{ name: 'Brand', value: 'Brand B' },
				{ name: 'Size', value: 'L' }
			]
		});

		winston.info('- Added products');
	}
};

const addEmailTemplates = async db => {
	const emailTemplatesCount = await db
		.collection('emailTemplates')
		.countDocuments({ name: 'order_confirmation' });
	const emailTemplatesNotExists = emailTemplatesCount === 0;
	if (emailTemplatesNotExists) {
		await db.collection('emailTemplates').insertOne({
			name: 'order_confirmation',
			subject: 'Order confirmation',
			body: `<div>
			<div><b>Order number</b>: {{number}}</div>
			<div><b>Shipping method</b>: {{shipping_method}}</div>
			<div><b>Payment method</b>: {{payment_method}}</div>
		  
			<div style="width: 100%; margin-top: 20px;">
			  Shipping to<br /><br />
			  <b>Full name</b>: {{shipping_address.full_name}}<br />
			  <b>Address 1</b>: {{shipping_address.address1}}<br />
			  <b>Address 2</b>: {{shipping_address.address2}}<br />
			  <b>Postal code</b>: {{shipping_address.postal_code}}<br />
			  <b>City</b>: {{shipping_address.city}}<br />
			  <b>State</b>: {{shipping_address.state}}<br />
			  <b>Phone</b>: {{shipping_address.phone}}
			</div>
		  
			<table style="width: 100%; margin-top: 20px;">
			  <tr>
				<td style="width: 40%; padding: 10px 0px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; text-align: left;">Item</td>
				<td style="width: 25%; padding: 10px 0px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; text-align: right;">Price</td>
				<td style="width: 10%; padding: 10px 0px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; text-align: right;">Qty</td>
				<td style="width: 25%; padding: 10px 0px; border-top: 1px solid #ccc; border-bottom: 1px solid #ccc; text-align: right;">Total</td>
			  </tr>
		  
			  {{#each items}}
			  <tr>
				<td style="padding: 10px 0px; border-bottom: 1px solid #ccc; text-align: left;">{{name}}<br />{{variant_name}}</td>
				<td style="padding: 10px 0px; border-bottom: 1px solid #ccc; text-align: right;">$ {{price}}</td>
				<td style="padding: 10px 0px; border-bottom: 1px solid #ccc; text-align: right;">{{quantity}}</td>
				<td style="padding: 10px 0px; border-bottom: 1px solid #ccc; text-align: right;">$ {{price_total}}</td>
			  </tr>
			  {{/each}}
		  
			</table>
		  
			<table style="width: 100%; margin: 20px 0;">
			  <tr>
				<td style="width: 80%; padding: 10px 0px; text-align: right;"><b>Subtotal</b></td>
				<td style="width: 20%; padding: 10px 0px; text-align: right;">$ {{subtotal}}</td>
			  </tr>
			  <tr>
				<td style="width: 80%; padding: 10px 0px; text-align: right;"><b>Shipping</b></td>
				<td style="width: 20%; padding: 10px 0px; text-align: right;">$ {{shipping_total}}</td>
			  </tr>
			  <tr>
				<td style="width: 80%; padding: 10px 0px; text-align: right;"><b>Grand total</b></td>
				<td style="width: 20%; padding: 10px 0px; text-align: right;">$ {{grand_total}}</td>
			  </tr>
			</table>
		  
		  </div>`
		});

		winston.info('- Added email template for Order Confirmation');
	}
};

const addShippingMethods = async db => {
	const shippingMethodsCount = await db
		.collection('shippingMethods')
		.countDocuments({});
	const shippingMethodsNotExists = shippingMethodsCount === 0;
	if (shippingMethodsNotExists) {
		await db.collection('shippingMethods').insertOne({
			name: 'Shipping method A',
			enabled: true,
			conditions: {
				countries: [],
				states: [],
				cities: [],
				subtotal_min: 0,
				subtotal_max: 0,
				weight_total_min: 0,
				weight_total_max: 0
			}
		});
		winston.info('- Added shipping method');
	}
};

const addPaymentMethods = async db => {
	const paymentMethodsCount = await db
		.collection('paymentMethods')
		.countDocuments({});
	const paymentMethodsNotExists = paymentMethodsCount === 0;
	if (paymentMethodsNotExists) {
		await db.collection('paymentMethods').insertOne({
			name: 'PayPal',
			enabled: true,
			conditions: {
				countries: [],
				shipping_method_ids: [],
				subtotal_min: 0,
				subtotal_max: 0
			}
		});
		winston.info('- Added payment method');
	}
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
		winston.info('- Created indexes for: pages');
	}

	const productCategoriesIndexes = await db
		.collection('productCategories')
		.listIndexes()
		.toArray();

	if (productCategoriesIndexes.length === 1) {
		await createIndex(db, 'productCategories', { enabled: 1 });
		await createIndex(db, 'productCategories', { slug: 1 });
		winston.info('- Created indexes for: productCategories');
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
		winston.info('- Created indexes for: products');
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
		winston.info('- Created indexes for: customers');
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
		winston.info('- Created indexes for: orders');
	}
};

const addUser = async (db, userEmail) => {
	if (userEmail && userEmail.includes('@')) {
		const tokensCount = await db.collection('tokens').countDocuments({
			email: userEmail
		});
		const tokensNotExists = tokensCount === 0;

		if (tokensNotExists) {
			await db.collection('tokens').insertOne({
				is_revoked: false,
				date_created: new Date(),
				expiration: 72,
				name: 'Owner',
				email: userEmail,
				scopes: ['admin']
			});
			winston.info(`- Added token with email: ${userEmail}`);
		}
	}
};

const addSettings = async (db, { domain }) => {
	if (domain && (domain.includes('https://') || domain.includes('http://'))) {
		await db.collection('settings').updateOne(
			{},
			{
				$set: {
					domain
				}
			},
			{ upsert: true }
		);
		winston.info(`- Set domain: ${domain}`);
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
		winston.info(`Successfully connected to ${mongodbConnection}`);
	} catch (e) {
		winston.error(`MongoDB connection was failed. ${e.message}`);
		return;
	}

	const userEmail = process.argv.length > 2 ? process.argv[2] : null;
	const domain = process.argv.length > 3 ? process.argv[3] : null;

	await db.createCollection('customers');
	await db.createCollection('orders');
	await addAllPages(db);
	await addAllProducts(db);
	await addEmailTemplates(db);
	await addShippingMethods(db);
	await addPaymentMethods(db);
	await createAllIndexes(db);
	await addUser(db, userEmail);
	await addSettings(db, {
		domain
	});

	client.close();
})();
