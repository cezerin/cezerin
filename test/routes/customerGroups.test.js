process.env.NODE_ENV = 'test';

// Import the test dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import 'chai/register-should';
import server from '../../src/api/server';

// Import the database
import { db } from '../../src/api/server/lib/mongo';

chai.use(chaiHttp);

let testCustomerGroup = {
	name: 'Test Customer Group',
	description: 'This is a test customer group'
};

let loggedInAdminToken, customerGroup;

describe('Customer Groups', () => {
	before(function(done) {
		// Empty database before proceeding with tests
		db.collection('customerGroups').drop();

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
		describe('/POST customer groups', function() {
			it('should POST a new customer group', function(done) {
				chai
					.request(server)
					.post(`/api/v1/customer_groups`)
					.set('Authorization', loggedInAdminToken)
					.send(testCustomerGroup)
					.end((err, res) => {
						customerGroup = res.body;
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('name').eql('Test Customer Group');
						res.body.should.have
							.property('description')
							.eql('This is a test customer group');
						res.body.should.have.property('id');
						done();
					});
			});
		});

		describe('/GET customer groups', function() {
			it('should GET all the customer groups', function(done) {
				chai
					.request(server)
					.get(`/api/v1/customer_groups`)
					.set('Authorization', loggedInAdminToken)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('array');
						res.body.length.should.be.eql(1);
						done();
					});
			});

			it('should GET a single customer group', function(done) {
				chai
					.request(server)
					.get(`/api/v1/customer_groups/${customerGroup.id}`)
					.set('Authorization', loggedInAdminToken)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('name').eql('Test Customer Group');
						res.body.should.have
							.property('description')
							.eql('This is a test customer group');
						res.body.should.have.property('id');
						done();
					});
			});
		});

		describe('/PUT customer groups', function() {
			it('should UPDATE a customer group', function(done) {
				let updateCustomerGroup = {
					name: 'Updated Customer Group',
					description: 'This is an updated customer group'
				};

				chai
					.request(server)
					.put(`/api/v1/customer_groups/${customerGroup.id}`)
					.set('Authorization', loggedInAdminToken)
					.send(updateCustomerGroup)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('name').eql('Updated Customer Group');
						res.body.should.have
							.property('description')
							.eql('This is an updated customer group');
						res.body.should.have.property('id');
						done();
					});
			});
		});

		describe('/DELETE customer groups', function() {
			it('should DELETE a customer group', function(done) {
				chai
					.request(server)
					.delete(`/api/v1/customer_groups/${customerGroup.id}`)
					.set('Authorization', loggedInAdminToken)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.empty;
						done();
					});
			});
		});

		// If NOT in developer mode, all routes should provide a 401 error.
		describe('For Non-Admin users', function() {
			describe('/POST customer groups', function() {
				it('should give a 401 error when POSTing a new customer group', function(done) {
					chai
						.request(server)
						.post(`/api/v1/customer_groups`)
						.send(testCustomerGroup)
						.end((err, res) => {
							res.should.have.status(401);
							done();
						});
				});
			});
		});

		describe('/GET customer groups', function() {
			it('should give a 401 error when GETTING all the customer groups', function(done) {
				chai
					.request(server)
					.get(`/api/v1/customer_groups`)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});

			it('should give a 401 error when GETTING a single customer group', function(done) {
				chai
					.request(server)
					.get(`/api/v1/customer_groups/${customerGroup.id}`)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});

		describe('/PUT customer groups', function() {
			it('should give a 401 error when UPDATING a customer group', function(done) {
				let updateCustomerGroup = {
					name: 'Updated Customer Group',
					description: 'This is an updated customer group'
				};

				chai
					.request(server)
					.put(`/api/v1/customer_groups/${customerGroup.id}`)
					.send(updateCustomerGroup)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});

		describe('/DELETE customer groups', function() {
			it('should give a 401 error when DELETEing a customer group', function(done) {
				chai
					.request(server)
					.delete(`/api/v1/customer_groups/${customerGroup.id}`)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
		});
	});
});
