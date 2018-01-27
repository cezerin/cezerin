'use strict';

const mongo = require('../../lib/mongo');
const utils = require('../../lib/utils');
const parse = require('../../lib/parse');
const ObjectID = require('mongodb').ObjectID;

class CustomerGroupsService {
  constructor() {}

  getGroups(params = {}) {
    return mongo.db.collection('customerGroups').find().toArray().then(items => items.map(item => this.changeProperties(item)))
  }

  getSingleGroup(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    let groupObjectID = new ObjectID(id);

    return mongo.db.collection('customerGroups').findOne({_id: groupObjectID}).then(item => this.changeProperties(item))
  }

  addGroup(data) {
    const group = this.getValidDocumentForInsert(data);
    return mongo.db.collection('customerGroups').insertMany([group]).then(res => this.getSingleGroup(res.ops[0]._id.toString()));
  }

  updateGroup(id, data) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const groupObjectID = new ObjectID(id);
    const group = this.getValidDocumentForUpdate(id, data);

    return mongo.db.collection('customerGroups').updateOne({
      _id: groupObjectID
    }, {$set: group}).then(res => this.getSingleGroup(id));
  }

  deleteGroup(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const groupObjectID = new ObjectID(id);
    return mongo.db.collection('customerGroups').deleteOne({'_id': groupObjectID}).then(deleteResponse => {
      return deleteResponse.deletedCount > 0;
    });
  }

  getValidDocumentForInsert(data) {
    let group = {
      'date_created': new Date()
    };

    group.name = parse.getString(data.name);
    group.description = parse.getString(data.description);

    return group;
  }

  getValidDocumentForUpdate(id, data) {
    if (Object.keys(data).length === 0) {
      return new Error('Required fields are missing');
    }

    let group = {
      'date_updated': new Date()
    }

    if (data.name !== undefined) {
      group.name = parse.getString(data.name);
    }

    if (data.description !== undefined) {
      group.description = parse.getString(data.description);
    }

    return group;
  }

  changeProperties(item) {
    if (item) {
      item.id = item._id.toString();
      delete item._id;
    }

    return item;
  }
}

module.exports = new CustomerGroupsService();
