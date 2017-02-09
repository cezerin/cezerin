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
       this.router.get('/text', this.getText.bind(this));
   }

   getCountries(req, res) {
     res.send(DataService.getCountries())
   }

   getCurrencies(req, res) {
     res.send(DataService.getCurrencies())
   }

   getText(req, res) {
     res.send(DataService.getText())
   }

   getErrorMessage(err) {
     return { 'error': true, 'message': err.toString() };
   }
}

module.exports = DataController;
