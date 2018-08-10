process.env.NODE_ENV = 'test';

// Import services
import security from '../../src/api/server/lib/security';
import CustomersService from '../../src/api/server/services/customers/customers';
import parse from '../../src/api/server/lib/parse';

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

// Drop customers collection to start with blank slate.
describe('Customers', () => {
	before(function() {});
	let user, totalCount, addresses;

	describe('/POST customers', function() {
		it('should POST a new customer', function(done) {
			chai
				.request(server)
				.post('/api/v1/customers/')
				.send(CustomersService.getValidDocumentForInsert(testCustomer))
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
				.send(CustomersService.getValidDocumentForInsert(testCustomer))
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
				.send(parse.getCustomerAddress(testAddress))
				.end((err, res) => {
					// TODO
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
				.end((err, res) => {
					// console.log(res.body.data[0].addresses);
					totalCount = res.body.total_count;
					res.should.have.status(200);
					res.should.be.a('object');
					res.body.should.have.property('data');
					res.body.data.length.should.be.eql(totalCount);
					// res.body.data.length.should.be.eql(3);
					done();
				});
		});

		it('should GET a single customer with id', function(done) {
			chai
				.request(server)
				.get(`/api/v1/customers/${user.id}`)
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

		it('should UPDATE a single customer with id', function(done) {
			let updateData = {};

			updateData.full_name = parse.getString('Updated Customer');
			updateData.email = parse
				.getString('updatedcustomer@test.com')
				.toLowerCase();

			chai
				.request(server)
				.put(`/api/v1/customers/${user.id}`)
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

			updateAddressData.address1 = parse.getString('4931 SW Theo Avenue');

			chai
				.request(server)
				.put(`/api/v1/customers/${user.id}/addresses/${addresses[0].id}`)
				.send(updateAddressData)
				.end((err, res) => {
					// TODO
					res.should.have.status(200);
					// res.body.should.have.property('address1').eql('4931 SW Theo Avenue');
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
				.end((err, res) => {
					// TODO
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
				.end((err, res) => {
					// TODO
					res.should.have.status(200);
					done();
				});
		});

		it('should DELETE a single customers address with id', function(done) {
			chai
				.request(server)
				.delete(`/api/v1/customers/${user.id}/addresses/${addresses[0].id}`)
				.end((err, res) => {
					// TODO
					res.should.have.status(200);
					done();
				});
		});

		it('should DELETE a single customer with id', function(done) {
			chai
				.request(server)
				.delete(`/api/v1/customers/${user.id}`)
				.end((err, res) => {
					console.log(res.body);
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.be;
					done();
				});
		});
	});
});
