'use strict';

const settings = require('../lib/settings');
var mongo = require('../lib/mongo');
var ObjectID = require('mongodb').ObjectID;

/* TODO
*/
class SitemapService {
  constructor() {}

  getPaths() {
    return new Promise((resolve, reject) => {
      let paths = [];

      paths.push({
        path: 'api',
        type: 'reserved'
      });

      paths.push({
        path: 'assets',
        type: 'reserved'
      });

      paths.push({
        path: 'static',
        type: 'reserved'
      });

      mongo.db.collection('productCategories')
        .find()
        .project({ slug:1 })
        .toArray()
        .then((items) => {
          for(const item of items) {
            paths.push({
              path: item.slug,
              type: 'product-category',
              resource: item._id
            });
          }
          resolve(paths);
        })
        .catch((err) => { reject(this.getErrorMessage(err)) });
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
