process.env.NODE_ENV = 'test';

// Import services
import OrdersService from '../src/api/server/services/orders/orders';
import OrderAddressService from '../src/api/server/services/orders/orderAddress';
import OrderItemsService from '../src/api/server/services/orders/orderItems';
import OrdertTansactionsService from '../src/api/server/services/orders/orderTransactions';
import OrdertDiscountsService from '../src/api/server/services/orders/orderDiscounts';
import SettingsService from '../src/api/server/services/settings/settings';
import PaymentGateways from '../src/api/server/paymentGateways';

// Import the test dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import 'chai/register-should';
import server from '../src/api/server';

// Import the database
import { db } from '../src/api/server/lib/mongo';

chai.use(chaiHttp);

let testOrder = {};

describe('Orders', () => {
	before(done => {
		db.orders.drop();
		done();
	});
});

describe('/POST orders', () => {
	it('should POST an order', done => {
		chai
			.request(server)
			.post('/api/v1/orders/')
			.end((err, res) => {
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
