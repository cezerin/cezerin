process.env.NODE_ENV = 'test';

// Import the test dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import 'chai/register-should';
import server from '../../src/api/server';

// Import the database
import { db } from '../../src/api/server/lib/mongo';

chai.use(chaiHttp);

let testCustomer = {
	note: 'Test',
	email: 'testcustomer@test.com',
	mobile: '1234567890',
	full_name: 'Test Customer',
	gender: 'Male',
	group_id: '1',
	tags: 'twat',
	social_accounts: [],
	birthdate: '10.15.1986',
	addresses: '',
	browser: ''
};

let testAddress = {
	address1: '25 Test Avenue',
	address2: '',
	city: 'Testville',
	country: 'United Testdom',
	state: 'Testegon',
	phone: '1234567890',
	postal_code: '45493',
	full_name: 'Mr. Theo',
	company: '',
	tax_number: '',
	coordinates: '',
	details: '',
	default_billing: false,
	default_shipping: false
};

let loggedInAdminToken, user, addresses;

describe('Customers', () => {
	before(function(done) {
		// Empty database before proceeding with tests
		db.collection('customers').drop();

		// Create a Test Admin user for testing, adjust this e-mail address to
		// match an existing user.
		let existingAdminEmail = 'admin@test.com';

		chai
			.request(server)
			.post(`/api/v1/authorize`)
			.set('content-type', 'application/x-www-form-urlencoded')
			.send({ email: existingAdminEmail })
			.end((err, res) => {
				loggedInAdminToken = res.body.token;
				done();
			});
	});

	describe('For Admin users', function() {
		describe('/POST customers', function() {
			it('should POST a new customer', function(done) {
				chai
					.request(server)
					.post('/api/v1/customers/')
					.set('Authorization', loggedInAdminToken)
					.send(testCustomer)
					.end((err, res) => {
						user = res.body;
						res.should.have.status(200);
						res.should.be.a('object');
						res.body.should.have.property('email').eql('testcustomer@test.com');
						res.body.should.have.property('full_name').eql('Test Customer');
						res.body.should.have.property('date_created');
						done();
					});
			});

			it('should NOT POST a duplicate customer', function(done) {
				chai
					.request(server)
					.post('/api/v1/customers/')
					.set('Authorization', loggedInAdminToken)
					.send(testCustomer)
					.end((err, res) => {
						res.should.have.status(500);
						res.body.should.have.property('error').eql(true);
						done();
					});
			});

			it('should POST a new customer address', function(done) {
				chai
					.request(server)
					.post(`/api/v1/customers/${user.id}/addresses`)
					.set('Authorization', loggedInAdminToken)
					.send(testAddress)
					.end((err, res) => {
						// Returns an empty object, so can only test status.
						res.should.have.status(200);
						done();
					});
			});
		});

		describe('/GET customers', function() {
			it('should GET all the customers', function(done) {
				chai
					.request(server)
					.get('/api/v1/customers/')
					.set('Authorization', loggedInAdminToken)
					.end((err, res) => {
						res.should.have.status(200);
						res.should.be.a('object');
						res.body.should.have.property('data');
						res.body.should.have.property('total_count');
						res.body.data.length.should.be.eql(1);
						done();
					});
			});

			it('should GET a single customer with id', function(done) {
				chai
					.request(server)
					.get(`/api/v1/customers/${user.id}`)
					.set('Authorization', loggedInAdminToken)
					.end((err, res) => {
						addresses = res.body.addresses;
						res.should.have.status(200);
						res.should.be.a('object');
						res.body.should.have.property('email').eql('testcustomer@test.com');
						res.body.should.have.property('full_name').eql('Test Customer');
						res.body.should.have.property('date_created');
						res.body.should.have.property('addresses');
						done();
					});
			});
		});

		describe('/PUT customers', function() {
			it('should UPDATE a single customer with id', function(done) {
				let updateData = {};

				updateData.full_name = 'Updated Customer';
				updateData.email = 'updatedcustomer@test.com';

				chai
					.request(server)
					.put(`/api/v1/customers/${user.id}`)
					.set('Authorization', loggedInAdminToken)
					.send(updateData)
					.end((err, res) => {
						addresses = res.body.addresses;
						res.should.have.status(200);
						res.should.be.a('object');
						res.body.should.have.property('full_name').eql('Updated Customer');
						res.body.should.have
							.property('email')
							.eql('updatedcustomer@test.com');
						res.body.should.have.property('date_created');
						done();
					});
			});

			it('should UPDATE a single address with id', function(done) {
				let updateAddressData = {};

				updateAddressData.address1 = '4931 SW Theo Avenue';

				chai
					.request(server)
					.put(`/api/v1/customers/${user.id}/addresses/${addresses[0].id}`)
					.set('Authorization', loggedInAdminToken)
					.send(updateAddressData)
					.end((err, res) => {
						// Returns an empty object, so can only test status.
						res.should.have.status(200);
						done();
					});
			});

			it('should set a default billing address for a single customer with id', function(done) {
				chai
					.request(server)
					.post(
						`/api/v1/customers/${user.id}/addresses/${
							addresses[0].id
						}/default_billing`
					)
					.set('Authorization', loggedInAdminToken)
					.end((err, res) => {
						// Returns an empty object, so can only test status.
						res.should.have.status(200);
						done();
					});
			});

			it('should set a default shipping address for a single customer with id', function(done) {
				chai
					.request(server)
					.post(
						`/api/v1/customers/${user.id}/addresses/${
							addresses[0].id
						}/default_shipping`
					)
					.set('Authorization', loggedInAdminToken)
					.end((err, res) => {
						// Returns an empty object, so can only test status.
						res.should.have.status(200);
						done();
					});
			});
		});

		describe('/DELETE customers', function() {
			it('should DELETE a single customers address with id', function(done) {
				chai
					.request(server)
					.delete(`/api/v1/customers/${user.id}/addresses/${addresses[0].id}`)
					.set('Authorization', loggedInAdminToken)
					.end((err, res) => {
						// Returns an empty object, so can only test status.
						res.should.have.status(200);
						done();
					});
			});

			it('should DELETE a single customer with id', function(done) {
				chai
					.request(server)
					.delete(`/api/v1/customers/${user.id}`)
					.set('Authorization', loggedInAdminToken)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						done();
					});
			});
		});
	});

	// If NOT in developer mode, all routes should provide a 401 error.
	describe('For Non-Admin users', function() {
		describe('/POST customers', function() {
			it('should give a 401 error when POSTing a new customer', function(done) {
				chai
					.request(server)
					.post('/api/v1/customers/')
					.send(testCustomer)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});

			it('should give a 401 error when POSTing a duplicate customer', function(done) {
				chai
					.request(server)
					.post('/api/v1/customers/')
					.send(testCustomer)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});

			it('should give a 401 error when POSTing a new customer address', function(done) {
				chai
					.request(server)
					.post(`/api/v1/customers/${user.id}/addresses`)
					.send(testAddress)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});

		describe('/GET customers', function() {
			it('should give a 401 error when GETTING all customers', function(done) {
				chai
					.request(server)
					.get('/api/v1/customers/')
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});

			it('should give a 401 error when GETTING a single customer with id', function(done) {
				chai
					.request(server)
					.get(`/api/v1/customers/${user.id}`)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});

		describe('/PUT customers', function() {
			it('should give a 401 error when UPDATING a single customer with id', function(done) {
				let updateData = {};

				updateData.full_name = 'Updated Customer';
				updateData.email = 'updatedcustomer@test.com';

				chai
					.request(server)
					.put(`/api/v1/customers/${user.id}`)
					.send(updateData)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});

			it('should give a 401 error when UPDATING a single address with id', function(done) {
				let updateAddressData = {};

				updateAddressData.address1 = '4931 SW Theo Avenue';

				chai
					.request(server)
					.put(`/api/v1/customers/${user.id}/addresses/${addresses[0].id}`)
					.send(updateAddressData)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});

			it('should give a 401 error when setting a default billing address for a single customer with id', function(done) {
				chai
					.request(server)
					.post(
						`/api/v1/customers/${user.id}/addresses/${
							addresses[0].id
						}/default_billing`
					)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});

			it('should give a 401 error when setting a default shipping address for a single customer with id', function(done) {
				chai
					.request(server)
					.post(
						`/api/v1/customers/${user.id}/addresses/${
							addresses[0].id
						}/default_shipping`
					)
					.end((err, res) => {
						// Returns an empty object, so can only test status.
						res.should.have.status(401);
						done();
					});
			});
		});

		describe('/DELETE customers', function() {
			it('should give a 401 error when DELETING a single customers address with id', function(done) {
				chai
					.request(server)
					.delete(`/api/v1/customers/${user.id}/addresses/${addresses[0].id}`)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});

			it('should give a 401 error when DELETING a single customer with id', function(done) {
				chai
					.request(server)
					.delete(`/api/v1/customers/${user.id}`)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});
	});
});
