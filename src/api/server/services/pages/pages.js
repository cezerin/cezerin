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
    return mongo.db.collection('pages').find(filter).sort({ is_system:-1, slug:1 }).toArray().then(items => items.map(item => this.changeProperties(item)))
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
    return this.getValidDocumentForInsert(data)
    .then(page => mongo.db.collection('pages')
      .insertMany([page])
      .then(res => this.getSinglePage(res.ops[0]._id.toString())));
  }

  updatePage(id, data) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const pageObjectID = new ObjectID(id);

    return this.getValidDocumentForUpdate(id, data)
    .then(page => mongo.db.collection('pages')
      .updateOne({_id: pageObjectID}, {$set: page})
      .then(res => this.getSinglePage(id)));
  }

  deletePage(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const pageObjectID = new ObjectID(id);
    return mongo.db.collection('pages').deleteOne({'_id': pageObjectID, 'is_system': false}).then(deleteResponse => {
      return deleteResponse.deletedCount > 0;
    });
  }

  getValidDocumentForInsert(data) {
    let page = {
      'is_system': false,
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

  getValidDocumentForUpdate(id, data) {
    if (Object.keys(data).length === 0) {
      return Promise.reject('Required fields are missing');
    } else {

    }
    return this.getSinglePage(id).then(prevPageData => {
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

      if (data.enabled !== undefined && !prevPageData.is_system) {
        page.enabled = parse.getBooleanIfValid(data.enabled, true);
      }

      if (data.slug !== undefined  && !prevPageData.is_system) {
        let slug = data.slug;
        if(!slug || slug.length === 0) {
          slug = data.meta_title;
        }

        return utils.getAvailableSlug(slug, id)
        .then(newSlug => {
          page.slug = newSlug;
          return page;
        })

      } else {
        return page;
      }
    })
  }

  changeProperties(item) {
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
