'use strict';

var CustomersService = require('../services/customers/customers');

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

   getCustomers(req, res, next) {
     CustomersService.getCustomers(req.query)
      .then(data => { res.send(data) })
      .catch(next);
   }

   getSingleCustomer(req, res, next) {
     CustomersService.getSingleCustomer(req.params.id)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch(next);
   }



   addCustomer(req, res, next) {
     CustomersService.addCustomer(req.body)
      .then(data => { res.send(data) })
      .catch(next);
   }

   updateCustomer(req, res, next) {
     CustomersService.updateCustomer(req.params.id, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(next);
   }

   deleteCustomer(req, res, next) {
     CustomersService.deleteCustomer(req.params.id)
      .then(data => { res.status(data ? 200 : 404).end() })
      .catch(next);
   }

   addAddress(req, res, next) {
     const customer_id = req.params.id;
     CustomersService.addAddress(customer_id, req.body)
      .then(data => { res.end() })
      .catch(next);
   }

   updateAddress(req, res, next) {
     const customer_id = req.params.id;
     const address_id = req.params.address_id;
     CustomersService.updateAddress(customer_id, address_id, req.body)
      .then(data => { res.end() })
      .catch(next);
   }

   deleteAddress(req, res, next) {
     const customer_id = req.params.id;
     const address_id = req.params.address_id;
     CustomersService.deleteAddress(customer_id, address_id)
      .then(data => { res.end() })
      .catch(next);
   }

   setDefaultBilling(req, res, next) {
     const customer_id = req.params.id;
     const address_id = req.params.address_id;
     CustomersService.setDefaultBilling(customer_id, address_id)
      .then(data => { res.end() })
      .catch(next);
   }

   setDefaultShipping(req, res, next) {
     const customer_id = req.params.id;
     const address_id = req.params.address_id;
     CustomersService.setDefaultShipping(customer_id, address_id)
      .then(data => { res.end() })
      .catch(next);
   }
}

module.exports = CustomersController;
