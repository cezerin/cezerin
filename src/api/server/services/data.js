'use strict';

const fs = require('fs')
const path = require('path')
const text = require('../../../../data/locales/default/text.json');
const countriesArray = require('../../../../data/locales/default/countries.json');
const currenciesArray = require('../../../../data/locales/default/currencies.json');

class DataService {
  getCountries() {
    return countriesArray;
  }

  getCurrencies() {
    return currenciesArray;
  }

  getText() {
    return text;
  }
}

module.exports = new DataService();
