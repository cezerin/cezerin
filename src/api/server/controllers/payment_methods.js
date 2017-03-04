'use strict';

var PaymentMethodsService = require('../services/orders/payment_methods');

class PaymentMethodsController {
  constructor(router) {
        this.router = router;
        this.registerRoutes();
  }

  registerRoutes() {
       this.router.get('/payment_methods', this.getMethods.bind(this));
       this.router.post('/payment_methods', this.addMethod.bind(this));
       this.router.get('/payment_methods/:id', this.getSingleMethod.bind(this));
       this.router.put('/payment_methods/:id', this.updateMethod.bind(this));
       this.router.delete('/payment_methods/:id', this.deleteMethod.bind(this));
   }

   getMethods(req, res, next) {
     PaymentMethodsService.getMethods(req.query)
      .then(data => { res.send(data) })
      .catch(next);
   }

   getSingleMethod(req, res, next) {
     PaymentMethodsService.getSingleMethod(req.params.id)
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
     PaymentMethodsService.addMethod(req.body)
      .then(data => { res.send(data) })
      .catch(next);
   }


   updateMethod(req, res, next) {
     PaymentMethodsService.updateMethod(req.params.id, req.body)
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
     PaymentMethodsService.deleteMethod(req.params.id)
      .then(data => { res.status(data ? 200 : 404).end() })
      .catch(next);
   }
}

module.exports = PaymentMethodsController;
