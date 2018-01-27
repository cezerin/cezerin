'use strict';

const mongo = require('../../lib/mongo');
const parse = require('../../lib/parse');
const ObjectID = require('mongodb').ObjectID;

class ProductOptionsService {
  constructor() {}

  getOptions(productId) {
    if(!ObjectID.isValid(productId)) {
      return Promise.reject('Invalid identifier');
    }
    let productObjectID = new ObjectID(productId);

    return mongo.db.collection('products').findOne({ _id: productObjectID }, {fields: {options: 1}}).then(product => {
      if(product && product.options && product.options.length > 0) {
        return product.options.map(option => this.changeProperties(option)).sort((a,b) => (a.position - b.position ));
      } else {
        return []
      }
    })
  }

  getSingleOption(productId, optionId) {
    return this.getOptions(productId).then(options => options.find(option => option.id === optionId))
  }

  deleteOption(productId, optionId) {
    if(!ObjectID.isValid(productId) || !ObjectID.isValid(optionId)) {
      return Promise.reject('Invalid identifier');
    }
    let productObjectID = new ObjectID(productId);
    let optionObjectID = new ObjectID(optionId);

    return mongo.db.collection('products').updateOne({
      _id: productObjectID
    }, {
      $pull: {
        options: {
          id: optionObjectID
        }
      }
    }).then(res => this.getOptions(productId));
  }

  addOption(productId, data) {
    if(!ObjectID.isValid(productId)) {
      return Promise.reject('Invalid identifier');
    }
    let productObjectID = new ObjectID(productId);

    const optionData = this.getValidDocumentForInsert(data);

    return mongo.db.collection('products')
      .updateOne({ _id: productObjectID }, { $push: { options: optionData } })
      .then(res => this.getOptions(productId));
  }

  updateOption(productId, optionId, data) {
    if(!ObjectID.isValid(productId) || !ObjectID.isValid(optionId)) {
      return Promise.reject('Invalid identifier');
    }
    let productObjectID = new ObjectID(productId);
    let optionObjectID = new ObjectID(optionId);

    const optionData = this.getValidDocumentForUpdate(data);

    return mongo.db.collection('products').updateOne({
      _id: productObjectID,
      'options.id': optionObjectID
    }, {$set: optionData}).then(res => this.getOptions(productId));
  }

  getValidDocumentForInsert(data) {
    let option = {
      id: new ObjectID(),
      name: parse.getString(data.name),
      control: parse.getString(data.control),
      required: parse.getBooleanIfValid(data.required, true),
      position: parse.getNumberIfPositive(data.position) || 0,
      'values': []
    };

    if(option.control === '') {
      option.control = 'select';
    }

    return option;
  }

  getValidDocumentForUpdate(data) {
    if (Object.keys(data).length === 0) {
      return new Error('Required fields are missing');
    }

    let option = {};

    if (data.name !== undefined) {
      option['options.$.name'] = parse.getString(data.name);
    }

    if (data.control !== undefined) {
      option['options.$.control'] = parse.getString(data.control);
    }

    if (data.required !== undefined) {
      option['options.$.required'] = parse.getBooleanIfValid(data.required, true);
    }

    if (data.position !== undefined) {
      option['options.$.position'] = parse.getNumberIfPositive(data.position) || 0;
    }

    return option;
  }

  changeProperties(item) {
    if(item) {

      if(item.id) {
        item.id = item.id.toString();
      }

      if(item.values && item.values.length > 0) {
        item.values = item.values.map(value => {
          value.id = value.id.toString();
          return value;
        })
      }
    }

    return item;
  }
}

module.exports = new ProductOptionsService();
