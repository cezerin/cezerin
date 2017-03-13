'use strict';

var mongo = require('../lib/mongo');
var parse = require('../lib/parse');

class SitemapService {
  constructor() {}

  getPaths() {
    return Promise.all([this.getSlugArrayFromReserved(), this.getSlugArrayFromProductCategories(), this.getSlugArrayFromProducts(), this.getSlugArrayFromPages()]).then(([reserved, productCategories, products, pages]) => {
      let paths = [...reserved, ...productCategories, ...products, ...pages];
      return paths;
    });
  }

  getPathsWithoutSlashes(slug, onlyEnabled) {
    return Promise.all([this.getSlugArrayFromReserved(), this.getSlugArrayFromProductCategories(slug, onlyEnabled), this.getSlugArrayFromPages(slug, onlyEnabled)]).then(([reserved, productCategories, pages]) => {
      let paths = [...reserved, ...productCategories, ...pages];
      return paths;
    });
  }

  getPathsWithSlash(slug, onlyEnabled) {
    return this.getSlugArrayFromProducts(slug, onlyEnabled);
  }

  getSlugArrayFromReserved() {
    let paths = [];

    paths.push({path: '/api', type: 'reserved'});
    paths.push({path: '/ajax', type: 'reserved'});
    paths.push({path: '/assets', type: 'reserved'});
    paths.push({path: '/static', type: 'reserved'});
    paths.push({path: '/admin', type: 'reserved'});
    paths.push({path: '/signin', type: 'reserved'});
    paths.push({path: '/signout', type: 'reserved'});
    paths.push({path: '/signup', type: 'reserved'});
    paths.push({path: '/post', type: 'reserved'});
    paths.push({path: '/posts', type: 'reserved'});
    paths.push({path: '/public', type: 'reserved'});
    paths.push({path: '/rss', type: 'reserved'});
    paths.push({path: '/feed', type: 'reserved'});
    paths.push({path: '/setup', type: 'reserved'});
    paths.push({path: '/tag', type: 'reserved'});
    paths.push({path: '/tags', type: 'reserved'});
    paths.push({path: '/user', type: 'reserved'});
    paths.push({path: '/users', type: 'reserved'});
    paths.push({path: '/sitemap.xml', type: 'reserved'});
    paths.push({path: '/robots.txt', type: 'reserved'});

    return paths;
  }

  getSlugArrayFromProducts(slug, onlyEnabled) {
    const categoriesFilter = {};
    const productsFilter = {};

    if(slug) {
      const slugParts = slug.split('/');
      categoriesFilter.slug = slugParts[0];
      productsFilter.slug = slugParts[1];
    }

    if(onlyEnabled === true) {
      categoriesFilter.enabled = productsFilter.enabled = true;
    }

    return Promise.all([
      mongo.db.collection('productCategories').find(categoriesFilter).project({slug: 1}).toArray(),
      mongo.db.collection('products').find(productsFilter).project({slug: 1, category_id: 1}).toArray()
    ]).then(([categories, products]) => {
      return products.map(product => {
        const category = categories.find(c => c._id == product.category_id);
        const categorySlug = category
          ? category.slug
          : '-';
        return {path: `/${categorySlug}/${product.slug}`, type: 'product', resource: product._id}
      })
    });

  }

  getSlugArrayFromPages(slug, onlyEnabled) {
    const filter = this.getFilterWithoutSlashes(slug);
    if(onlyEnabled === true) {
      filter.enabled = true;
    }

    return mongo.db.collection('pages').find(filter).project({slug: 1}).toArray().then(items =>
      items.map(item => ({path: `/${item.slug}`, type: 'page', resource: item._id}))
    )
  }

  getSlugArrayFromProductCategories(slug, onlyEnabled) {
    const filter = this.getFilterWithoutSlashes(slug);
    if(onlyEnabled === true) {
      filter.enabled = true;
    }

    return mongo.db.collection('productCategories').find(filter).project({slug: 1}).toArray().then(items =>
      items.map(item => ({path: `/${item.slug}`, type: 'product-category', resource: item._id}))
    )
  }

  getFilterWithoutSlashes(slug) {
    if(slug) {
      return {slug: slug}
    } else {
      return {}
    }
  }

  getSinglePath(path, onlyEnabled = false) {
    onlyEnabled = parse.getBooleanIfValid(onlyEnabled, false);
    // convert path to slash (remove first slash)
    const slug = path.substr(1);
    if(slug.includes('/')) {
      // slug = category-slug/product-slug
      return this.getPathsWithSlash(slug, onlyEnabled).then(paths => paths.find(e => e.path === path))
    } else {
      // slug = slug
      return this.getPathsWithoutSlashes(slug, onlyEnabled).then(paths => paths.find(e => e.path === path))
    }
  }
}

module.exports = new SitemapService();
