'use strict';

var OrderStatusesService = require('../../services/orders/order_statuses');

class OrderStatusesController {
  constructor(router) {
        this.router = router;
        this.registerRoutes();
  }

  registerRoutes() {
       this.router.get('/order_statuses', this.getStatuses.bind(this));
       this.router.post('/order_statuses', this.addStatus.bind(this));
       this.router.get('/order_statuses/:id', this.getSingleStatus.bind(this));
       this.router.put('/order_statuses/:id', this.updateStatus.bind(this));
       this.router.delete('/order_statuses/:id', this.deleteStatus.bind(this));
   }

   getStatuses(req, res) {
     OrderStatusesService.getStatuses(req.query)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getSingleStatus(req, res) {
     OrderStatusesService.getSingleStatus(req.params.id)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   addStatus(req, res) {
     OrderStatusesService.addStatus(req.body)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }


   updateStatus(req, res) {
     OrderStatusesService.updateStatus(req.params.id, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   deleteStatus(req, res) {
     OrderStatusesService.deleteStatus(req.params.id)
      .then(data => { res.end() })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getErrorMessage(err) {
     return { 'error': true, 'message': err.toString() };
   }
}

module.exports = OrderStatusesController;
