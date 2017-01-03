'use strict';

var CustomersService = require('../services/customers');

class CustomersController {
  constructor(router) {
        this.router = router;
        this.registerRoutes();
  }

  registerRoutes() {
      this.router.get('/customers', this.getCustomers.bind(this));
      this.router.post('/customers', this.addCustomer.bind(this));
      this.router.get('/customers/:id', this.getSingleCustomer.bind(this));
      this.router.put('/customers/:id', this.updateCustomer.bind(this));
      this.router.delete('/customers/:id', this.deleteCustomer.bind(this));
      this.router.post('/customers/:id/addresses', this.addAddress.bind(this));
      this.router.put('/customers/:id/addresses/:address_id', this.updateAddress.bind(this));
      this.router.delete('/customers/:id/addresses/:address_id', this.deleteAddress.bind(this));
      this.router.post('/customers/:id/addresses/:address_id/default_billing', this.setDefaultBilling.bind(this));
      this.router.post('/customers/:id/addresses/:address_id/default_shipping', this.setDefaultShipping.bind(this));
   }

   getCustomers(req, res) {
     CustomersService.getCustomers(req.query)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getSingleCustomer(req, res) {
     CustomersService.getSingleCustomer(req.params.id)
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

   addAddress(req, res) {
     const customer_id = req.params.id;
     CustomersService.addAddress(customer_id, req.body)
      .then(data => { res.end() })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   updateAddress(req, res) {
     const customer_id = req.params.id;
     const address_id = req.params.address_id;
     CustomersService.updateAddress(customer_id, address_id, req.body)
      .then(data => { res.end() })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   deleteAddress(req, res) {
     const customer_id = req.params.id;
     const address_id = req.params.address_id;
     CustomersService.deleteAddress(customer_id, address_id)
      .then(data => { res.end() })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   setDefaultBilling(req, res) {
     const customer_id = req.params.id;
     const address_id = req.params.address_id;
     CustomersService.setDefaultBilling(customer_id, address_id)
      .then(data => { res.end() })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   setDefaultShipping(req, res) {
     const customer_id = req.params.id;
     const address_id = req.params.address_id;
     CustomersService.setDefaultShipping(customer_id, address_id)
      .then(data => { res.end() })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getErrorMessage(err) {
     return { 'error': true, 'message': err.toString() };
   }
}

module.exports = CustomersController;
