'use strict';

var mongo = require('../../lib/mongo');
var utils = require('../../lib/utils');
var parse = require('../../lib/parse');
var ObjectID = require('mongodb').ObjectID;
var customerGroupsService = require('./customer_groups');

class CustomersService {
  constructor() {}

  getCustomers(params = {}) {
    // sort
    // fields
    // tag
    // gender
    // date_created_to
    // date_created_from
    // total_spent_to
    // total_spent_from
    // orders_count_to
    // orders_count_from

    let filter = {};
    const group_id = parse.getObjectIDIfValid(params.group_id);
    if (group_id) {
      filter.group_id = group_id;
    }

    if (params.email) {
      filter.email = params.email.toLowerCase();
    }

    if (params.search) {
      filter['$or'] = [
        {
          '$text': {
            '$search': params.search
          }
        }, {
          email: {
            $regex: '*${params.search}*',
            $options: 'i'
          }
        }
      ]
    }

    const limit = parse.getNumberIfPositive(params.limit) || 1000000;
    const offset = parse.getNumberIfPositive(params.offset) || 0;

    return customerGroupsService.getGroups().then(customerGroups => mongo.db.collection('customers').find(filter).sort({date_created: -1}).skip(offset).limit(limit).toArray().then(customers => customers.map(customer => {
      const customerGroup = customer.group_id
        ? customerGroups.find(group => group.id === customer.group_id)
        : null;

      return this.changeProperties(customer, customerGroup)
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
    }).then(({customer, group}) => this.changeProperties(customer, group));
  }

  addCustomer(data) {
    const customer = this.getValidDocumentForInsert(data);
    return Promise.resolve(customer).then(customer => {
      // is email unique
      if (customer.email && customer.email.length > 0) {
        return mongo.db.collection('customers').count({email: customer.email}).then(count => count === 0
          ? customer
          : Promise.reject('Customer email must be unique'));
      } else {
        return customer;
      }
    }).then(customer => mongo.db.collection('customers').insertMany([customer])).then(res => this.getSingleCustomer(res.ops[0]._id.toString()))
  }

  updateCustomer(id, data) {
    if (!ObjectID.isValid(id)) {
      return Promise.reject('Invalid identifier');
    }
    const customerObjectID = new ObjectID(id);
    const customer = this.getValidDocumentForUpdate(id, data);

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
    return mongo.db.collection('customers').deleteOne({'_id': customerObjectID}).then(deleteResponse => {
      return deleteResponse.deletedCount > 0;
    });
  }

  getValidDocumentForInsert(data) {
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
    customer.email = parse.getString(data.email).toLowerCase();
    customer.mobile = parse.getString(data.mobile).toLowerCase();
    customer.full_name = parse.getString(data.full_name);
    customer.gender = parse.getString(data.gender).toLowerCase();
    customer.group_id = parse.getObjectIDIfValid(data.group_id);
    customer.tags = parse.getArrayIfValid(data.tags) || [];
    customer.social_accounts = parse.getArrayIfValid(data.social_accounts) || [];
    customer.birthdate = parse.getDateIfValid(data.birthdate);
    customer.addresses = this.validateAddresses(data.addresses);
    customer.browser = parse.getBrowser(data.browser);

    return customer;
  }

  validateAddresses(addresses) {
    if (addresses && addresses.length > 0) {
      let validAddresses = addresses.map(addressItem => parse.getCustomerAddress(addressItem));
      return validAddresses;
    } else {
      return [];
    }
  }

  getValidDocumentForUpdate(id, data) {
    if (Object.keys(data).length === 0) {
      return new Error('Required fields are missing');
    }

    let customer = {
      'date_updated': new Date()
    };

    if (data.note !== undefined) {
      customer.note = parse.getString(data.note);
    }

    if (data.email !== undefined) {
      customer.email = parse.getString(data.email).toLowerCase();
    }

    if (data.mobile !== undefined) {
      customer.mobile = parse.getString(data.mobile).toLowerCase();
    }

    if (data.full_name !== undefined) {
      customer.full_name = parse.getString(data.full_name);
    }

    if (data.gender !== undefined) {
      customer.gender = parse.getString(data.gender);
    }

    if (data.group_id !== undefined) {
      customer.group_id = parse.getObjectIDIfValid(data.group_id);
    }

    if (data.tags !== undefined) {
      customer.tags = parse.getArrayIfValid(data.tags) || [];
    }

    if (data.social_accounts !== undefined) {
      customer.social_accounts = parse.getArrayIfValid(data.social_accounts) || [];
    }

    if (data.birthdate !== undefined) {
      customer.birthdate = parse.getDateIfValid(data.birthdate);
    }

    if (data.addresses !== undefined) {
      customer.addresses = this.validateAddresses(data.addresses);
    }

    if (data.browser !== undefined) {
      customer.browser = parse.getBrowser(data.browser);
    }

    return customer;
  }

  changeProperties(customer, customerGroup) {
    if (customer) {
      customer.id = customer._id.toString();
      delete customer._id;

      customer.group_name = customerGroup && customerGroup.name
        ? customerGroup.name
        : '';

      if (customer.addresses && customer.addresses.length === 1) {
        customer.billing = customer.shipping = customer.addresses[0];
      } else if (customer.addresses && customer.addresses.length > 1) {
        let default_billing = customer.addresses.find(address => address.default_billing);
        let default_shipping = customer.addresses.find(address => address.default_shipping);
        customer.billing = default_billing
          ? default_billing
          : customer.addresses[0];
        customer.shipping = default_shipping
          ? default_shipping
          : customer.addresses[0];
      } else {
        customer.billing = {};
        customer.shipping = {};
      }
    }

    return customer;
  }

  addAddress(customer_id, address) {
    if (!ObjectID.isValid(customer_id)) {
      return Promise.reject('Invalid identifier');
    }
    let customerObjectID = new ObjectID(customer_id);
    const validAddress = parse.getCustomerAddress(address);

    return mongo.db.collection('customers').updateOne({
      _id: customerObjectID
    }, {
      $push: {
        addresses: validAddress
      }
    });
  }

  createObjectToUpdateAddressFields(data) {
    let fields = {};
    for (let fieldName of Object.keys(data)) {
      fields['addresses.$.' + fieldName] = data[fieldName];
    }
    return fields;
  }

  updateAddress(customer_id, address_id, data) {
    if (!ObjectID.isValid(customer_id) || !ObjectID.isValid(address_id)) {
      return Promise.reject('Invalid identifier');
    }
    let customerObjectID = new ObjectID(customer_id);
    let addressObjectID = new ObjectID(address_id);
    const addressFields = this.createObjectToUpdateAddressFields(data);

    return mongo.db.collection('customers').updateOne({
      _id: customerObjectID,
      'addresses.id': addressObjectID
    }, {$set: addressFields});
  }

  deleteAddress(customer_id, address_id) {
    if (!ObjectID.isValid(customer_id) || !ObjectID.isValid(address_id)) {
      return Promise.reject('Invalid identifier');
    }
    let customerObjectID = new ObjectID(customer_id);
    let addressObjectID = new ObjectID(address_id);

    return mongo.db.collection('customers').updateOne({
      _id: customerObjectID
    }, {
      $pull: {
        addresses: {
          id: addressObjectID
        }
      }
    });
  }

  setDefaultBilling(customer_id, address_id) {
    if (!ObjectID.isValid(customer_id) || !ObjectID.isValid(address_id)) {
      return Promise.reject('Invalid identifier');
    }
    let customerObjectID = new ObjectID(customer_id);
    let addressObjectID = new ObjectID(address_id);

    return mongo.db.collection('customers').updateOne({
      _id: customerObjectID,
      'addresses.default_billing': true
    }, {
      $set: {
        'addresses.$.default_billing': false
      }
    }).then(res => {
      return mongo.db.collection('customers').updateOne({
        _id: customerObjectID,
        'addresses.id': addressObjectID
      }, {
        $set: {
          'addresses.$.default_billing': true
        }
      });
    });
  }

  setDefaultShipping(customer_id, address_id) {
    if (!ObjectID.isValid(customer_id) || !ObjectID.isValid(address_id)) {
      return Promise.reject('Invalid identifier');
    }
    let customerObjectID = new ObjectID(customer_id);
    let addressObjectID = new ObjectID(address_id);

    return mongo.db.collection('customers').updateOne({
      _id: customerObjectID,
      'addresses.default_shipping': true
    }, {
      $set: {
        'addresses.$.default_shipping': false
      }
    }).then(res => {
      return mongo.db.collection('customers').updateOne({
        _id: customerObjectID,
        'addresses.id': addressObjectID
      }, {
        $set: {
          'addresses.$.default_shipping': true
        }
      });
    });
  }

}

module.exports = new CustomersService();
