'use strict';

var PaymentMethodsService = require('../../services/orders/payment_methods');

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

   getMethods(req, res) {
     PaymentMethodsService.getMethods(req.query)
      .then(data => { setTimeout(() => {res.send(data)}, 3000) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getSingleMethod(req, res) {
     PaymentMethodsService.getSingleMethod(req.params.id)
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
     PaymentMethodsService.addMethod(req.body)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }


   updateMethod(req, res) {
     PaymentMethodsService.updateMethod(req.params.id, req.body)
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
     PaymentMethodsService.deleteMethod(req.params.id)
      .then(data => { res.end() })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getErrorMessage(err) {
     return { 'error': true, 'message': err.toString() };
   }
}

module.exports = PaymentMethodsController;
