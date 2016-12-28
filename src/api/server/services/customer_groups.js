'use strict';

var mongo = require('../lib/mongo');
var utils = require('../lib/utils');
var parse = require('../lib/parse');
var ObjectID = require('mongodb').ObjectID;
var _ = require('lodash');

class CustomerGroupsService {
  constructor() {}

  getGroups(params) {
    return mongo.db.collection('customerGroups').find().toArray().then(items => items.map(item => this.renameDocumentFields(item)))
  }

  getSingleGroup(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    let groupObjectID = new ObjectID(id);

    return mongo.db.collection('customerGroups').findOne({_id: groupObjectID}).then(item => this.renameDocumentFields(item))
  }

  addGroup(data) {
    const group = this.getDocumentForInsert(data);
    return mongo.db.collection('customerGroups').insertMany([group]).then(res => this.getSingleGroup(res.ops[0]._id.toString()));
  }

  updateGroup(id, data) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const groupObjectID = new ObjectID(id);
    const group = this.getDocumentForUpdate(id, data);

    return mongo.db.collection('customerGroups').updateOne({
      _id: groupObjectID
    }, {$set: group}).then(res => this.getSingleGroup(id));
  }

  deleteGroup(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const groupObjectID = new ObjectID(id);
    return mongo.db.collection('customerGroups').deleteOne({'_id': groupObjectID}).then(res => {
      return true;
    });
  }

  getErrorMessage(err) {
    return {'error': true, 'message': err.toString()};
  }

  getDocumentForInsert(data) {
    let group = {
      'date_created': new Date()
    };

    group.name = parse.getString(data.name);
    group.description = parse.getString(data.description);

    return group;
  }

  getDocumentForUpdate(id, data) {
    if (_.isEmpty(data)) {
      return new Error('Required fields are missing');
    }

    let group = {
      'date_updated': new Date()
    };

    if (!_.isUndefined(data.name)) {
      group.name = parse.getString(data.name);
    }

    if (!_.isUndefined(data.description)) {
      group.description = parse.getString(data.description);
    }

    return group;
  }

  renameDocumentFields(item) {
    if (item) {
      item.id = item._id.toString();
      delete item._id;
    }

    return item;
  }
}

module.exports = new CustomerGroupsService();
