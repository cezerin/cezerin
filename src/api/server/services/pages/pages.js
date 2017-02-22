'use strict';

const url = require('url');
const settings = require('../../lib/settings');
var mongo = require('../../lib/mongo');
var utils = require('../../lib/utils');
var parse = require('../../lib/parse');
var ObjectID = require('mongodb').ObjectID;

class PagesService {
  constructor() {}

  getFilter(params = {}) {
    let filter = {};
    const id = parse.getObjectIDIfValid(params.id);
    if (id) {
      filter._id = new ObjectID(id);
    }
    return filter;
  }

  getPages(params = {}) {
    const filter = this.getFilter(params);
    return mongo.db.collection('pages').find(filter).toArray().then(items => items.map(item => this.renameDocumentFields(item)))
  }

  getSinglePage(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    return this.getPages({id: id}).then(pages => {
      return pages.length > 0
        ? pages[0]
        : null;
    })
  }

  addPage(data) {
    return this.getDocumentForInsert(data)
    .then(page => mongo.db.collection('pages')
      .insertMany([page])
      .then(res => this.getSinglePage(res.ops[0]._id.toString())));
  }

  updatePage(id, data) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const pageObjectID = new ObjectID(id);

    return this.getDocumentForUpdate(id, data)
    .then(page => mongo.db.collection('pages')
      .updateOne({_id: pageObjectID}, {$set: page})
      .then(res => this.getSinglePage(id)));
  }

  deletePage(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const pageObjectID = new ObjectID(id);
    return mongo.db.collection('pages').deleteOne({'_id': pageObjectID}).then(res => {
      return true;
    });
  }

  getErrorMessage(err) {
    return {'error': true, 'message': err.toString()};
  }

  getDocumentForInsert(data) {
    let page = {
      'date_created': new Date()
    };

    page.content = parse.getString(data.content);
    page.meta_description = parse.getString(data.meta_description);
    page.meta_title = parse.getString(data.meta_title);
    page.enabled = parse.getBooleanIfValid(data.enabled, true);

    let slug = (!data.slug || data.slug.length === 0) ? data.meta_title : data.slug;
    if(!slug || slug.length === 0) {
      return Promise.resolve(page);
    } else {
      return utils.getAvailableSlug(slug).then(newSlug => {
        page.slug = newSlug;
        return page;
      });
    }
  }

  getDocumentForUpdate(id, data) {
    return new Promise((resolve, reject) => {
      if(!ObjectID.isValid(id)) {
        reject('Invalid identifier');
      }
      if (Object.keys(data).length === 0) {
        reject('Required fields are missing');
      }

      let page = {
        'date_updated': new Date()
      };

      if (data.content !== undefined) {
        page.content = parse.getString(data.content);
      }

      if (data.meta_description !== undefined) {
        page.meta_description = parse.getString(data.meta_description);
      }

      if (data.meta_title !== undefined) {
        page.meta_title = parse.getString(data.meta_title);
      }

      if (data.enabled !== undefined) {
        page.enabled = parse.getBooleanIfValid(data.enabled, true);
      }

      if (data.slug !== undefined) {
        let slug = data.slug;
        if(!slug || slug.length === 0) {
          slug = data.meta_title;
        }

        utils.getAvailableSlug(slug, id)
        .then((newSlug) => {
          page.slug = newSlug;
          resolve(page);
        })
        .catch((err) => {
          reject(err);
        });

      } else {
        resolve(page);
      }
    });
  }

  renameDocumentFields(item) {
    if (item) {
      item.id = item._id.toString();
      delete item._id;

      item.url = url.resolve(settings.storeBaseUrl, item.slug || '');
      item.path = url.resolve('/', item.slug || '');
    }

    return item;
  }
}

module.exports = new PagesService();
