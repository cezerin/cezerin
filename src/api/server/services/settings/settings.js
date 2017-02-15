'use strict';

var mongo = require('../../lib/mongo');
var parse = require('../../lib/parse');

class SettingsService {
  constructor() {
    this.defaultSettings = {
      'language': 'en',
      'currency_code': 'USD',
      'currency_format': '${amount}',
      'thousand_separator': ',',
      'decimal_separator': '.',
      'decimal_number': 2,
      'timezone': 'America/Danmarkshavn',
      'date_format': 'MMM D, YYYY',
      'time_format': 'h:mm a',
      'default_shipping_сountry': 'US',
      'default_shipping_state': '',
      'default_shipping_city': '',
      'default_product_sorting': 'price_asc',
      'weight_unit': 'kg',
      'length_unit': 'cm'
    }
  }

  getSettings() {
    return mongo.db.collection('settings').findOne().then(settings => {
      return this.renameDocumentFields(settings);
    });
  }

  updateSettings(data) {
    const settings = this.getDocumentForUpdate(data);
    return this.insertDefaultSettingsIfEmpty().then(() => mongo.db.collection('settings').updateOne({}, {
      $set: settings
    }, {upsert: true}).then(res => this.getSettings()));
  }

  insertDefaultSettingsIfEmpty() {
    return mongo.db.collection('settings').count().then(count => {
      if (count === 0) {
        return mongo.db.collection('settings').insertOne(this.defaultSettings);
      } else {
        return;
      }
    });
  }

  getDocumentForUpdate(data) {
    if (Object.keys(data).length === 0) {
      return new Error('Required fields are missing');
    }

    let settings = {}

    if (data.language !== undefined) {
      settings.language = parse.getString(data.language);
    }

    if (data.currency_code !== undefined) {
      settings.currency_code = parse.getString(data.currency_code);
    }

    if (data.currency_format !== undefined) {
      settings.currency_format = parse.getString(data.currency_format);
    }

    if (data.thousand_separator !== undefined) {
      settings.thousand_separator = parse.getString(data.thousand_separator);
    }

    if (data.decimal_separator !== undefined) {
      settings.decimal_separator = parse.getString(data.decimal_separator);
    }

    if (data.decimal_number !== undefined) {
      settings.decimal_number = parse.getNumberIfPositive(data.decimal_number) || 2;
    }

    if (data.timezone !== undefined) {
      settings.timezone = parse.getString(data.timezone);
    }

    if (data.date_format !== undefined) {
      settings.date_format = parse.getString(data.date_format);
    }

    if (data.time_format !== undefined) {
      settings.time_format = parse.getString(data.time_format);
    }

    if (data.default_shipping_сountry !== undefined) {
      settings.default_shipping_сountry = parse.getString(data.default_shipping_сountry);
    }

    if (data.default_shipping_state !== undefined) {
      settings.default_shipping_state = parse.getString(data.default_shipping_state);
    }

    if (data.default_shipping_city !== undefined) {
      settings.default_shipping_city = parse.getString(data.default_shipping_city);
    }

    if (data.default_product_sorting !== undefined) {
      settings.default_product_sorting = parse.getString(data.default_product_sorting);
    }

    if (data.weight_unit !== undefined) {
      settings.weight_unit = parse.getString(data.weight_unit);
    }

    if (data.length_unit !== undefined) {
      settings.length_unit = parse.getString(data.length_unit);
    }

    return settings;
  }

  renameDocumentFields(settings) {
    if (settings) {
      delete settings._id;
    } else {
      return this.defaultSettings;
    }

    return settings;
  }
}

module.exports = new SettingsService();
