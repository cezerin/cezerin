'use strict';

var CustomersService = require('../../services/customers/customers');

class CustomersController {
  constructor(router) {
        this.router = router;
        this.registerRoutes();
  }

  registerRoutes() {
       this.router.get('/customers', this.getCustomers.bind(this));
       this.router.get('/customers/:id', this.getSingleCustomer.bind(this));
       this.router.post('/customers/', this.addCustomer.bind(this));
       this.router.put('/customers/:id', this.updateCustomer.bind(this));
       this.router.delete('/customers/:id', this.deleteCustomer.bind(this));
   }

   getCustomers(req, res) {
     CustomersService.getCustomers(req.query)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getSingleCustomer(req, res) {
     CustomersService.getSingleCustomer(req.params.id, req.query.currency)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   addCustomer(req, res) {
     CustomersService.addCustomer(req.body)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }


   updateCustomer(req, res) {
     CustomersService.updateCustomer(req.params.id, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   deleteCustomer(req, res) {
     CustomersService.deleteCustomer(req.params.id)
      .then(data => { res.end() })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getErrorMessage(err) {
     return { 'error': true, 'message': err.toString() };
   }
}

module.exports = CustomersController;
