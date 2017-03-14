'use strict';

const security = require('../lib/security');
var OrderStatusesService = require('../services/orders/order_statuses');

class OrderStatusesController {
  constructor(router) {
    this.router = router;
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get('/order_statuses', security.checkUserScope.bind(this, security.scope.READ_ORDER_STATUSES), this.getStatuses.bind(this));
    this.router.post('/order_statuses', security.checkUserScope.bind(this, security.scope.WRITE_ORDER_STATUSES), this.addStatus.bind(this));
    this.router.get('/order_statuses/:id', security.checkUserScope.bind(this, security.scope.READ_ORDER_STATUSES), this.getSingleStatus.bind(this));
    this.router.put('/order_statuses/:id', security.checkUserScope.bind(this, security.scope.WRITE_ORDER_STATUSES), this.updateStatus.bind(this));
    this.router.delete('/order_statuses/:id', security.checkUserScope.bind(this, security.scope.WRITE_ORDER_STATUSES), this.deleteStatus.bind(this));
  }

  getStatuses(req, res, next) {
    OrderStatusesService.getStatuses(req.query).then(data => {
      res.send(data)
    }).catch(next);
  }

  getSingleStatus(req, res, next) {
    OrderStatusesService.getSingleStatus(req.params.id).then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).end()
      }
    }).catch(next);
  }

  addStatus(req, res, next) {
    OrderStatusesService.addStatus(req.body).then(data => {
      res.send(data)
    }).catch(next);
  }

  updateStatus(req, res, next) {
    OrderStatusesService.updateStatus(req.params.id, req.body).then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).end()
      }
    }).catch(next);
  }

  deleteStatus(req, res, next) {
    OrderStatusesService.deleteStatus(req.params.id).then(data => {
      res.status(data
        ? 200
        : 404).end()
    }).catch(next);
  }
}

module.exports = OrderStatusesController;
