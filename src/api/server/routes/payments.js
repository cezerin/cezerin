'use strict';

const PaymentGateways = require('../paymentGateways');

class PaymentsRoute {
  constructor(router) {
    this.router = router;
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.post('/v1/payments/:gateway', this.processPayment.bind(this));
  }

  processPayment(req, res, next) {
    PaymentGateways.processPayment(req, res, req.params.gateway);
  }
}

module.exports = PaymentsRoute;