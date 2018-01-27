'use strict';

const mongo = require('../../lib/mongo');
const parse = require('../../lib/parse');

class AppSettingsService {
  constructor() {}

  getSettings(appKey) {
    return mongo.db.collection('appSettings').findOne({key: appKey}, { _id: 0, key: 0 });
  }

  updateSettings(appKey, data) {
    if (Object.keys(data).length === 0) {
      return new Error('Required fields are missing');
    }

    delete data.key;

    return mongo.db.collection('appSettings').updateOne({key: appKey}, {
      $set: data
    }, {upsert: true}).then(res => this.getSettings(appKey));
  }
}

module.exports = new AppSettingsService();
