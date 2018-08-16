process.env.NODE_ENV = 'test';

// Import services
import security from '../../src/api//server/lib/security';
import CategoriesService from '../../src/api/server/services/products/productCategories';

// Import the test dependencies
import chai from 'chai';
import chaiHttp from 'chai-http';
import 'chai/register-should';
import server from '../../src/api/server';

// Import the database
import { db } from '../../src/api/server/lib/mongo';

chai.use(chaiHttp);

let testCategory = {
	image: '',
	name: 'Test Category',
	description: 'Testing Category Description',
	meta_description: '',
	meta_title: '',
	enabled: true,
	sort: '',
	parent_id: null,
	position: 1,
	slug: 'test-category',
	url: '/test-category',
	path: '/test-category'
};

// console.log(CategoriesService.getValidDocumentForInsert(testCategory));

describe('Product Categories', function() {
	before(function() {
		db.collection('productCategories').drop();
	});
	let category;

	describe('For Admin Users', function() {
		describe('/POST categories', function() {
			it('should POST a new category', function(done) {
				chai
					.request(server)
					.post(`/api/v1/product_categories`)
					.send(testCategory)
					.end((err, res) => {
						category = res.body;
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('name').eql('Test Category');
						res.body.should.have
							.property('description')
							.eql('Testing Category Description');
						res.body.should.have.property('id');
						done();
					});
			});

			it('should POST a new image for a category', function(done) {
				chai
					.request(server)
					.post(`/api/v1/product_categories/${category.id}/image`)
					.field('Content-Type', 'multipart/form-data')
					.attach('files', './test/test_image.png', 'test_image.png')
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.have.property('file').eql('test_image.png');
						done();
					});
			});
		});

		describe('/GET categories', function() {
			it('should GET all categories', function(done) {
				chai
					.request(server)
					.get(`/api/v1/product_categories`)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('array');
						res.body.length.should.be.eql(1);
						done();
					});
			});

			it('should GET a single category', function(done) {
				chai
					.request(server)
					.get(`/api/v1/product_categories/${category.id}`)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('name').eql('Test Category');
						res.body.should.have
							.property('description')
							.eql('Testing Category Description');
						res.body.should.have.property('id');
						done();
					});
			});
		});

		describe('/PUT categories', function() {
			it('should UPDATE an existing category', function(done) {
				let updateCategory = {
					name: 'Updated Test Category',
					description: 'Testing Updated Category Description'
				};

				chai
					.request(server)
					.put(`/api/v1/product_categories/${category.id}`)
					.send(updateCategory)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.have.property('name').eql('Updated Test Category');
						res.body.should.have
							.property('description')
							.eql('Testing Updated Category Description');
						res.body.should.have.property('id');
						done();
					});
			});
		});

		describe('/DELETE categories', function() {
			it('should DELETE an image for a category', function(done) {
				chai
					.request(server)
					.delete(`/api/v1/product_categories/${category.id}/image`)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.empty;
						done();
					});
			});

			it('should DELETE an existing category', function(done) {
				chai
					.request(server)
					.delete(`/api/v1/product_categories/${category.id}`)
					.end((err, res) => {
						res.should.have.status(200);
						res.body.should.be.a('object');
						res.body.should.be.empty;
						done();
					});
			});
		});
	});

	describe('For Non-Admin Users', function() {});
});
