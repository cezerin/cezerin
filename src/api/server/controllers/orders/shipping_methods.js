'use strict';

var ShippingMethodsService = require('../../services/orders/shipping_methods');

class ShippingMethodsController {
  constructor(router) {
        this.router = router;
        this.registerRoutes();
  }

  registerRoutes() {
       this.router.get('/shipping_methods', this.getMethods.bind(this));
       this.router.post('/shipping_methods', this.addMethod.bind(this));
       this.router.get('/shipping_methods/:id', this.getSingleMethod.bind(this));
       this.router.put('/shipping_methods/:id', this.updateMethod.bind(this));
       this.router.delete('/shipping_methods/:id', this.deleteMethod.bind(this));
   }

   getMethods(req, res) {
     ShippingMethodsService.getMethods(req.query)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getSingleMethod(req, res) {
     ShippingMethodsService.getSingleMethod(req.params.id)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   addMethod(req, res) {
     ShippingMethodsService.addMethod(req.body)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }


   updateMethod(req, res) {
     ShippingMethodsService.updateMethod(req.params.id, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   deleteMethod(req, res) {
     ShippingMethodsService.deleteMethod(req.params.id)
      .then(data => { res.end() })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getErrorMessage(err) {
     return { 'error': true, 'message': err.toString() };
   }
}

module.exports = ShippingMethodsController;
