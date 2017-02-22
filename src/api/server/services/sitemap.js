'use strict';

const settings = require('../lib/settings');
var mongo = require('../lib/mongo');
var ObjectID = require('mongodb').ObjectID;

class SitemapService {
  constructor() {}

  getPaths() {
    return Promise.all([
        this.getSlugArrayFromReserved(),
        this.getSlugArrayFromProductCategories(),
        this.getSlugArrayFromProducts(),
        this.getSlugArrayFromPages()
      ]).then(([ reserved, productCategories, products, pages ]) => {

        // TODO: Replace for/push to ES6 [...pages, ...products]
        let paths = [];

        for(const item of reserved) {
          paths.push(item);
        }

        for(const item of productCategories) {
          paths.push(item);
        }

        for(const item of products) {
          paths.push(item);
        }

        for(const item of pages) {
          paths.push(item);
        }

        return paths;
      });
  }

  getSlugArrayFromReserved() {
    let paths = [];

    paths.push({
      path: '/',
      type: 'reserved'
    });

    paths.push({
      path: '/checkout',
      type: 'reserved'
    });

    paths.push({
      path: '/checkout-success',
      type: 'reserved'
    });

    paths.push({
      path: '/cart',
      type: 'reserved'
    });

    paths.push({
      path: '/api',
      type: 'reserved'
    });

    paths.push({
      path: '/assets',
      type: 'reserved'
    });

    paths.push({
      path: '/static',
      type: 'reserved'
    });

    paths.push({
      path: '/admin',
      type: 'reserved'
    });

    return paths;
  }

  getSlugArrayFromProducts() {
    return mongo.db.collection('productCategories')
      .find()
      .project({ slug:1 })
      .toArray()
      .then(categories => {
        return mongo.db.collection('products')
          .find()
          .project({ slug:1, category_id:1 })
          .toArray()
          .then(products => {
            return products.map(product => {
              const category = categories.find(c => c._id == product.category_id);
              const categorySlug = category ? category.slug : '-';
              return {
                path: `/${categorySlug}/${product.slug}`,
                type: 'product',
                resource: product._id
              }
            })
          });
      });
  }

  getSlugArrayFromPages() {
    return mongo.db.collection('pages')
      .find()
      .project({ slug:1 })
      .toArray()
      .then((items) => {
        let newPath = [];
        for(const item of items) {
          newPath.push({
            path: `/${item.slug}`,
            type: 'page',
            resource: item._id
          });
        }
        return newPath;
      });
  }

  getSlugArrayFromProductCategories() {
    return mongo.db.collection('productCategories')
      .find()
      .project({ slug:1 })
      .toArray()
      .then((items) => {
        let newPath = [];
        for(const item of items) {
          newPath.push({
            path: `/${item.slug}`,
            type: 'product-category',
            resource: item._id
          });
        }
        return newPath;
      });
  }

  getSinglePath(path) {
    return new Promise((resolve, reject) => {
      this.getPaths()
        .then((paths) => {
          let findedPath = paths.find(e => e.path === path);
          resolve(findedPath);
        })
        .catch((err) => { reject(this.getErrorMessage(err)) });
      });
  }

  getErrorMessage(err) {
    return { 'error': true, 'message': err.toString() };
  }
}

module.exports = new SitemapService();
