'use strict';

var DataService = require('../services/data');

class DataController {
  constructor(router) {
        this.router = router;
        this.registerRoutes();
  }

  registerRoutes() {
       this.router.get('/countries', this.getCountries.bind(this));
       this.router.get('/currencies', this.getCurrencies.bind(this));
   }

   getCountries(req, res) {
     DataService.getCountries()
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getCurrencies(req, res) {
     DataService.getCurrencies()
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getErrorMessage(err) {
     return { 'error': true, 'message': err.toString() };
   }
}

module.exports = DataController;
