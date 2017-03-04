'use strict';

var ShippingMethodsService = require('../services/orders/shipping_methods');

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

   getMethods(req, res, next) {
     ShippingMethodsService.getMethods(req.query)
      .then(data => { res.send(data) })
      .catch(next);
   }

   getSingleMethod(req, res, next) {
     ShippingMethodsService.getSingleMethod(req.params.id)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch(next);
   }

   addMethod(req, res, next) {
     ShippingMethodsService.addMethod(req.body)
      .then(data => { res.send(data) })
      .catch(next);
   }


   updateMethod(req, res, next) {
     ShippingMethodsService.updateMethod(req.params.id, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(next);
   }

   deleteMethod(req, res, next) {
     ShippingMethodsService.deleteMethod(req.params.id)
      .then(data => { res.status(data ? 200 : 404).end() })
      .catch(next);
   }
}

module.exports = ShippingMethodsController;
