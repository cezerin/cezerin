'use strict';

var DataService = require('../services/data');

class DataController {
  constructor(router) {
        this.router = router;
        this.registerRoutes();
  }

  registerRoutes() {
      //  this.router.get('/countries', this.getCountries.bind(this));
      //  this.router.get('/currencies', this.getCurrencies.bind(this));
   }

  //  getCountries(req, res, next) {
  //    res.send(DataService.getCountries())
  //  }
   //
  //  getCurrencies(req, res, next) {
  //    res.send(DataService.getCurrencies())
  //  }
}

module.exports = DataController;
