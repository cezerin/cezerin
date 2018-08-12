process.env.NODE_ENV = 'test';

// Import services
import OrdersService from '../../src/api/server/services/orders/orders';
import OrderAddressService from '../../src/api/server/services/orders/orderAddress';
import OrderItemsService from '../../src/api/server/services/orders/orderItems';
import OrdertTansactionsService from '../../src/api/server/services/orders/orderTransactions';
import OrdertDiscountsService from '../../src/api/server/services/orders/orderDiscounts';
import SettingsService from '../../src/api/server/services/settings/settings';
import PaymentGateways from '../../src/api/server/paymentGateways';

// Import the test dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import 'chai/register-should';
import server from '../../src/api/server';

// Import the database
import { db } from '../../src/api/server/lib/mongo';

chai.use(chaiHttp);

let testItem = {
	name: 'Product A',
	slug: 'product-a',
	category_id: '5b6b02ee1dc55368eb0d4a63',
	stock_quantity: 1,
	enabled: true,
	discontinued: false,
	attributes: [
		{
			name: 'Brand',
			value: 'Brand A'
		},
		{
			name: 'Size',
			value: 'M'
		}
	],
	regular_price: 950,
	on_sale: false,
	variable: false,
	price: 950,
	stock_status: 'available',
	url: '/category-a/product-a',
	path: '/category-a/product-a',
	category_name: 'Category A',
	category_slug: 'category-a',
	id: ''
};

let testAddress = {
	address1: '25 Test Avenue',
	address2: '',
	city: 'Testville',
	country: 'United Testdom',
	state: 'Testington',
	phone: '123456789',
	postal_code: '04182',
	full_name: 'Test Customer',
	company: '',
	tax_number: '',
	coordinates: {
		latitude: '',
		longitude: ''
	},
	details: null
};

let testOrder = {
	date_created: '',
	date_placed: '',
	date_updated: '',
	date_closed: null,
	date_paid: null,
	date_cancelled: null,
	number: 1001,
	shipping_status: '',
	items: testItem,
	transactions: [],
	discounts: [],
	billing_address: testAddress,
	shipping_address: testAddress,
	item_tax: 0,
	shipping_tax: 0,
	shipping_discount: 0,
	shipping_price: 0,
	item_tax_included: true,
	shipping_tax_included: true,
	closed: false,
	cancelled: false,
	delivered: false,
	paid: false,
	hold: false,
	draft: false,
	email: 'testcustomer@test.com',
	mobile: '1234567890',
	referrer_url: '',
	landing_url: '',
	channel: '',
	note: '',
	comments: '',
	coupon: '',
	tracking_number: '',
	customer_id: '',
	status_id: null,
	payment_method_id: '',
	shipping_method_id: '',
	tags: '',
	browser: '',
	id: '',
	status: '',
	shipping_method: 'Shipping method A',
	payment_method: 'PayPal',
	weight_total: 0,
	discount_total: 0,
	subtotal: 950,
	tax_included_total: 0,
	tax_total: 0,
	shipping_total: 0,
	grand_total: 950
};

describe('Orders', () => {
	before(done => {
		db.collection('orders').drop();
		done();
	});

	describe('/POST orders', () => {
		it('should POST an order', done => {
			chai
				.request(server)
				.post('/api/v1/orders/')
				.send(testOrder)
				.end((err, res) => {
					// console.log(res.body);
					res.should.have.status(200);
					done();
				});
		});
	});

	describe('/GET orders', () => {
		it('should GET all the orders', done => {
			chai
				.request(server)
				.get('/api/v1/orders/')
				.end((err, res) => {
					res.should.have.status(200);
					// res.body.data.length.should.be.eql(10);
					done();
				});
		});
	});
});

// this.router.get('/v1/orders', this.getOrders.bind(this)
//
// this.router.post('/v1/orders', this.addOrder.bind(this)
//
// this.router.get('/v1/orders/:id', this.getSingleOrder.bind(this)
//
// this.router.put('/v1/orders/:id', this.updateOrder.bind(this)
//
// this.router.delete('/v1/orders/:id', this.deleteOrder.bind(this)
//
// this.router.put('/v1/orders/:id/recalculate', this.recalculateOrder.bind(this)
//
// this.router.put('/v1/orders/:id/checkout', this.checkoutOrder.bind(this)
//
// this.router.put('/v1/orders/:id/cancel', this.cancelOrder.bind(this)
//
// this.router.put('/v1/orders/:id/close', this.closeOrder.bind(this)
//
// this.router.put('/v1/orders/:id/billing_address', this.updateBillingAddress.bind(this)
//
// this.router.put('/v1/orders/:id/shipping_address', this.updateShippingAddress.bind(this)
//
// this.router.post('/v1/orders/:id/items', this.addItem.bind(this)
//
// this.router.put('/v1/orders/:id/items/:item_id', this.updateItem.bind(this)
//
// this.router.delete('/v1/orders/:id/items/:item_id', this.deleteItem.bind(this)
//
// this.router.post('/v1/orders/:id/transactions', this.addTransaction.bind(this)
//
// this.router.put('/v1/orders/:id/transactions/:transaction_id', this.updateTransaction.bind(this)
//
// this.router.delete('/v1/orders/:id/transactions/:transaction_id', this.deleteTransaction.bind(this)
//
// this.router.post('/v1/orders/:id/discounts', this.addDiscount.bind(this)
//
// this.router.put('/v1/orders/:id/discounts/:discount_id', this.updateDiscount.bind(this)
//
// this.router.delete('/v1/orders/:id/discounts/:discount_id', this.deleteDiscount.bind(this)
//
// this.router.get('/v1/orders/:id/payment_form_settings', this.getPaymentFormSettings.bind(this)
//
// this.router.post('/v1/orders/:id/charge', this.chargeOrder.bind(this)
