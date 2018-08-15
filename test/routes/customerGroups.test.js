process.env.NODE_ENV = 'test';

import security from '../../src/api/server/lib/security';
import CustomerGroupsService from '../../src/api/server/services/customers/customerGroups';

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

describe('Customer Groups', () => {
	before(function() {
		db.collection('customerGroups').drop();
	});
	let customerGroup;

	describe('For Admin users', function() {
		describe('/POST customer groups', function() {
			it('should POST a new customer group', function(done) {
				chai
					.request(server)
					.post(`/api/v1/customer_groups`)
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
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.empty;
						done();
					});
			});
		});

		describe('For Non-Admin users', function() {});
	});
});

// this.router.get('/v1/customer_groups/:id',this.getSingleGroup.bind(this)
//
// this.router.put('/v1/customer_groups/:id',this.updateGroup.bind(this)
//
// this.router.delete('/v1/customer_groups/:id', this.deleteGroup.bind(this)
