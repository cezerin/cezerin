'use strict';

var OrdersService = require('../../services/orders/orders');
var OrderAddressService = require('../../services/orders/order_address');
var OrderItemsService = require('../../services/orders/order_items');
var OrdertTansactionsService = require('../../services/orders/order_transactions');
var OrdertDiscountsService = require('../../services/orders/order_discounts');

class OrdersController {
  constructor(router) {
        this.router = router;
        this.registerRoutes();
  }

  registerRoutes() {
      this.router.get('/orders', this.getOrders.bind(this));
      this.router.post('/orders', this.addOrder.bind(this));
      this.router.get('/orders/:id', this.getSingleOrder.bind(this));
      this.router.put('/orders/:id', this.updateOrder.bind(this));
      this.router.delete('/orders/:id', this.deleteOrder.bind(this));

      this.router.put('/orders/:id/recalculate', this.recalculateOrder.bind(this));
      this.router.put('/orders/:id/checkout', this.checkoutOrder.bind(this));

      this.router.put('/orders/:id/billing_address', this.updateBillingAddress.bind(this));
      this.router.put('/orders/:id/shipping_address', this.updateShippingAddress.bind(this));

      this.router.post('/orders/:id/items', this.addItem.bind(this));
      this.router.put('/orders/:id/items/:item_id', this.updateItem.bind(this));
      this.router.delete('/orders/:id/items/:item_id', this.deleteItem.bind(this));

      this.router.post('/orders/:id/transactions', this.addTransaction.bind(this));
      this.router.put('/orders/:id/transactions/:transaction_id', this.updateTransaction.bind(this));
      this.router.delete('/orders/:id/transactions/:transaction_id', this.deleteTransaction.bind(this));

      this.router.post('/orders/:id/discounts', this.addDiscount.bind(this));
      this.router.put('/orders/:id/discounts/:discount_id', this.updateDiscount.bind(this));
      this.router.delete('/orders/:id/discounts/:discount_id', this.deleteDiscount.bind(this));
   }

   getOrders(req, res) {
     OrdersService.getOrders(req.query)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getSingleOrder(req, res) {
     OrdersService.getSingleOrder(req.params.id)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   addOrder(req, res) {
     OrdersService.addOrder(req.body)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   updateOrder(req, res) {
     OrdersService.updateOrder(req.params.id, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   deleteOrder(req, res) {
     OrdersService.deleteOrder(req.params.id)
      .then(data => { res.end() })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   recalculateOrder(req, res) {
     OrderItemsService.calculateAndUpdateAllItems(req.params.id)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   checkoutOrder(req, res) {
     OrdersService.checkoutOrder(req.params.id)
      .then(data => {
        setTimeout(() => {res.send(data)}, 5000)
       })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   updateBillingAddress(req, res) {
     OrderAddressService.updateBillingAddress(req.params.id, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   updateShippingAddress(req, res) {
     OrderAddressService.updateShippingAddress(req.params.id, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   addItem(req, res) {
     const order_id = req.params.id;
     OrderItemsService.addItem(order_id, req.body)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   updateItem(req, res) {
     const order_id = req.params.id;
     const item_id = req.params.item_id;
     OrderItemsService.updateItem(order_id, item_id, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   deleteItem(req, res) {
     const order_id = req.params.id;
     const item_id = req.params.item_id;
     OrderItemsService.deleteItem(order_id, item_id)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   addTransaction(req, res) {
     const order_id = req.params.id;
     OrdertTansactionsService.addTransaction(order_id, req.body)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   updateTransaction(req, res) {
     const order_id = req.params.id;
     const transaction_id = req.params.item_id;
     OrdertTansactionsService.updateTransaction(order_id, transaction_id, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   deleteTransaction(req, res) {
     const order_id = req.params.id;
     const transaction_id = req.params.item_id;
     OrdertTansactionsService.deleteTransaction(order_id, transaction_id)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   addDiscount(req, res) {
     const order_id = req.params.id;
     OrdertDiscountsService.addDiscount(order_id, req.body)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   updateDiscount(req, res) {
     const order_id = req.params.id;
     const discount_id = req.params.item_id;
     OrdertDiscountsService.updateDiscount(order_id, discount_id, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   deleteDiscount(req, res) {
     const order_id = req.params.id;
     const discount_id = req.params.item_id;
     OrdertDiscountsService.deleteDiscount(order_id, discount_id)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getErrorMessage(err) {
     return { 'error': true, 'message': err.toString() };
   }
}

module.exports = OrdersController;
