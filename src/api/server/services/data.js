'use strict';

const settings = require('../lib/settings')
const fs = require('fs')
const path = require('path')

class DataService {
  constructor() {
    this.countriesArray = null;
    this.currenciesArray = null;
  }

  getCountries() {
    return new Promise((resolve, reject) => {
      if (this.countriesArray) {
        resolve(this.countriesArray);
      } else {
        const filePath = path.resolve(`data/locales/${settings.language}/countries.json`);
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          } else {
            const countriesObject = JSON.parse(data);
            this.countriesArray = [];
            for (let countryCode in countriesObject) {
              this.countriesArray.push({code: countryCode, name: countriesObject[countryCode]})
            }
            resolve(this.countriesArray);
          }
        });
      }
    });
  }

  getCurrencies() {
    return new Promise((resolve, reject) => {
      if (this.currenciesArray) {
        resolve(this.currenciesArray);
      } else {
        const filePath = path.resolve(`data/locales/${settings.language}/currencies.json`);
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            reject(err);
          } else {
            const currenciesObject = JSON.parse(data);
            this.currenciesArray = [];
            for (let currencyCode in currenciesObject) {
              this.currenciesArray.push({code: currencyCode, name: currenciesObject[currencyCode]})
            }
            resolve(this.currenciesArray);
          }
        });
      }
    });
  }
}

module.exports = new DataService();
