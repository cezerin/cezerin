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

// this.router.get('/v1/product_categories',this.getCategories.bind(this)
// this.router.post('/v1/product_categories',this.addCategory.bind(this)
// this.router.get('/v1/product_categories/:id',this.getSingleCategory.bind(this)
// this.router.put('/v1/product_categories/:id',this.updateCategory.bind(this)
// this.router.delete('/v1/product_categories/:id',this.deleteCategory.bind(this)
// this.router.post('/v1/product_categories/:id/image',this.uploadCategoryImage.bind(this)
// this.router.delete('/v1/product_categories/:id/image', this.deleteCategoryImage.bind(this)
//
