'use strict';

var mongo = require('../lib/mongo');
var utils = require('../lib/utils');
var parse = require('../lib/parse');
var ObjectID = require('mongodb').ObjectID;
var _ = require('lodash');
var customerGroupsService = require('./customer_groups');

class CustomersService {
  constructor() {}

  getCustomers(params) {
    // sort
    // group_id
    // tag
    // fields
    // limit
    // offset
    // date_created_to
    // date_created_from
    // total_spent_to
    // total_spent_from
    // orders_count_to
    // orders_count_from
    // gender
    // search

    return customerGroupsService.getGroups().then(customerGroups => mongo.db.collection('customers').find().toArray().then(customes => customes.map(customer => {
      const customerGroup = customer.group_id
        ? customerGroups.find(group => group.id === customer.group_id)
        : null;

      return this.renameDocumentFields(customer, customerGroup)
    })));
  }

  getSingleCustomer(id) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    let customerObjectID = new ObjectID(id);

    return mongo.db.collection('customers').findOne({_id: customerObjectID}).then(customer => {
      return customer && customer.group_id
        ? customerGroupsService.getSingleGroup(customer.group_id).then(customerGroup => ({customer, group: customerGroup}))
        : {
          customer,
          group: null
        };
    }).then(({customer, group}) => this.renameDocumentFields(customer, group));
  }

  addCustomer(data) {
    const customer = this.getDocumentForInsert(data);
    return Promise.resolve(customer).then(customer => {
      // is email unique
      if (customer.email && customer.email.length > 0) {
        return mongo.db.collection('customers').count({email: customer.email}).then(count => count === 0
          ? customer
          : Promise.reject('Customer email must be unique'));
      } else {
        return customer;
      }
    }).then(customer => mongo.db.collection('customers').insertMany([customer])).then(res => this.Group(res.ops[0]._id.toString()))
  }

  updateCustomer(id, data) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const customerObjectID = new ObjectID(id);
    const customer = this.getDocumentForUpdate(id, data);

    return Promise.resolve(customer).then(customer => {
      // is SKU unique
      if (customer.sku && customer.sku.length > 0) {
        return mongo.db.collection('customers').count({
          _id: {
            $ne: customerObjectID
          },
          email: customer.email
        }).then(count => count === 0
          ? customer
          : Promise.reject('Customer email must be unique'));
      } else {
        return customer;
      }
    }).then(customer => mongo.db.collection('customers').updateOne({
      _id: customerObjectID
    }, {$set: customer})).then(res => this.getSingleCustomer(id))
  }

  deleteCustomer(customerId) {
    if (!ObjectID.isValid(customerId)) {
      return Promise.reject('Invalid identifier');
    }
    const customerObjectID = new ObjectID(customerId);
    return mongo.db.collection('customers').deleteOne({'_id': customerObjectID}).then(res => {
      return true;
    });
  }

  getErrorMessage(err) {
    return {'error': true, 'message': err.toString()};
  }

  getDocumentForInsert(data) {
    // email can be null

    let customer = {
      'date_created': new Date(),
      'date_last_visit': null,
      'date_updated': null,
      // 'order_ids': [],
      // 'total_spent': 0,
      // 'orders_count': 0
    };

    customer.note = parse.getString(data.note);
    customer.email = parse.getString(data.email);
    customer.first_name = parse.getString(data.first_name);
    customer.last_name = parse.getString(data.last_name);
    customer.gender = parse.getString(data.gender);
    customer.group_id = parse.getObjectIDIfValid(data.group_id);
    customer.tags = parse.getArrayIfValid(data.tags) || [];
    customer.social_accounts = parse.getArrayIfValid(data.social_accounts) || [];
    customer.birthdate = parse.getDateIfValid(data.birthdate);
    customer.addresses = this.validateAddresses(data.addresses);

    return customer;
  }

  validateAddresses(addresses) {
    if (addresses && addresses.length > 0) {
      let validAddresses = addresses.map(addressItem => ({
        'address1': parse.getString(addressItem.address1),
        'address2': parse.getString(addressItem.address2),
        'city': parse.getString(addressItem.city),
        'country': parse.getString(addressItem.country),
        'state': parse.getString(addressItem.state),
        'phone': parse.getString(addressItem.phone),
        'zip': parse.getString(addressItem.zip),
        'first_name': parse.getString(addressItem.first_name),
        'last_name': parse.getString(addressItem.last_name),
        'company': parse.getString(addressItem.company),
        'tax_number': parse.getString(addressItem.tax_number),
        'details': addressItem.details
      }))

      return validAddresses;
    } else {
      return [];
    }
  }

  getDocumentForUpdate(id, data) {
    if (_.isEmpty(data)) {
      return new Error('Required fields are missing');
    }

    let customer = {
      'date_updated': new Date()
    };

    if (!_.isUndefined(data.note)) {
      customer.note = parse.getString(data.note);
    }

    if (!_.isUndefined(data.email)) {
      customer.email = parse.getString(data.email);
    }

    if (!_.isUndefined(data.first_name)) {
      customer.first_name = parse.getString(data.first_name);
    }

    if (!_.isUndefined(data.last_name)) {
      customer.last_name = parse.getString(data.last_name);
    }

    if (!_.isUndefined(data.gender)) {
      customer.gender = parse.getString(data.gender);
    }

    if (!_.isUndefined(data.group_id)) {
      customer.group_id = parse.getObjectIDIfValid(data.group_id);
    }

    if (!_.isUndefined(data.tags)) {
      customer.tags = parse.getArrayIfValid(data.tags) || [];
    }

    if (!_.isUndefined(data.social_accounts)) {
      customer.social_accounts = parse.getArrayIfValid(data.social_accounts) || [];
    }

    if (!_.isUndefined(data.birthdate)) {
      customer.birthdate = parse.getDateIfValid(data.birthdate);
    }

    if (!_.isUndefined(data.addresses)) {
      customer.addresses = this.validateAddresses(data.addresses);
    }

    return customer;
  }

  renameDocumentFields(customer, customerGroup) {
    if (customer) {
      customer.id = customer._id.toString();
      delete customer._id;

      customer.group_name = customerGroup && customerGroup.name
        ? customerGroup.name
        : '';
    }

    return customer;
  }
}

module.exports = new CustomersService();
