'use strict';

const mongo = require('../lib/mongo');
const utils = require('../lib/utils');
const parse = require('../lib/parse');
const ObjectID = require('mongodb').ObjectID;
const cache = require('lru-cache')({
  max: 10000,
  maxAge: 1000 * 60 * 60 * 24 // 24h
});
const WEBHOOKS_CACHE_KEY = 'webhooks';

class WebhooksService {
  constructor() {}

  async getWebhooks() {
    const webhooksFromCache = cache.get(WEBHOOKS_CACHE_KEY);

    if (webhooksFromCache) {
      return webhooksFromCache;
    } else {
      const items = await mongo.db.collection('webhooks').find().toArray();
      const result = items.map(item => this.changeProperties(item));
      cache.set(WEBHOOKS_CACHE_KEY, result);
      return result;
    }
  }

  async getSingleWebhook(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    let webhookObjectID = new ObjectID(id);

    const item = await mongo.db.collection('webhooks').findOne({_id: webhookObjectID});
    const result = this.changeProperties(item);
    return result;
  }

  async addWebhook(data) {
    const webhook = this.getValidDocumentForInsert(data);
    const res = await mongo.db.collection('webhooks').insertMany([webhook]);
    cache.del(WEBHOOKS_CACHE_KEY);
    const newWebhookId = res.ops[0]._id.toString();
    const newWebhook = await this.getSingleWebhook(newWebhookId);
    return newWebhook;
  }

  async updateWebhook(id, data) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const webhookObjectID = new ObjectID(id);
    const webhook = this.getValidDocumentForUpdate(id, data);

    const res = await mongo.db.collection('webhooks').updateOne({
      _id: webhookObjectID
    }, {
      $set: webhook
    });

    cache.del(WEBHOOKS_CACHE_KEY);
    const newWebhook = await this.getSingleWebhook(id);
    return newWebhook;
  }

  async deleteWebhook(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const webhookObjectID = new ObjectID(id);
    const res = await mongo.db.collection('webhooks').deleteOne({_id: webhookObjectID});
    cache.del(WEBHOOKS_CACHE_KEY);
    return res.deletedCount > 0;
  }

  getValidDocumentForInsert(data) {
    let webhook = {
      'date_created': new Date()
    };

    webhook.description = parse.getString(data.description);
    webhook.url = parse.getString(data.url);
    webhook.secret = parse.getString(data.secret);
    webhook.enabled = parse.getBooleanIfValid(data.enabled, false);
    webhook.events = parse.getArrayIfValid(data.events) || [];

    return webhook;
  }

  getValidDocumentForUpdate(id, data) {
    if (Object.keys(data).length === 0) {
      return new Error('Required fields are missing');
    }

    let webhook = {
      'date_updated': new Date()
    };

    if (data.description !== undefined) {
      webhook.description = parse.getString(data.description);
    }

    if (data.url !== undefined) {
      webhook.url = parse.getString(data.url);
    }

    if (data.secret !== undefined) {
      webhook.secret = parse.getString(data.secret);
    }

    if (data.enabled !== undefined) {
      webhook.enabled = parse.getBooleanIfValid(data.enabled, false);
    }

    if(data.events !== undefined) {
      webhook.events = parse.getArrayIfValid(data.events) || [];
    }

    return webhook;
  }

  changeProperties(item) {
    if (item) {
      item.id = item._id.toString();
      item._id = undefined;
    }

    return item;
  }
}

module.exports = new WebhooksService();
