'use strict';

var CustomerGroupsService = require('../services/customers/customer_groups');

class CustomerGroupsController {
  constructor(router) {
        this.router = router;
        this.registerRoutes();
  }

  registerRoutes() {
       this.router.get('/customer_groups', this.getGroups.bind(this));
       this.router.post('/customer_groups', this.addGroup.bind(this));
       this.router.get('/customer_groups/:id', this.getSingleGroup.bind(this));
       this.router.put('/customer_groups/:id', this.updateGroup.bind(this));
       this.router.delete('/customer_groups/:id', this.deleteGroup.bind(this));
   }

   getGroups(req, res, next) {
     CustomerGroupsService.getGroups(req.query)
      .then(data => { res.send(data) })
      .catch(next);
   }

   getSingleGroup(req, res, next) {
     CustomerGroupsService.getSingleGroup(req.params.id)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch(next);
   }

   addGroup(req, res, next) {
     CustomerGroupsService.addGroup(req.body)
      .then(data => { res.send(data) })
      .catch(next);
   }


   updateGroup(req, res, next) {
     CustomerGroupsService.updateGroup(req.params.id, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(next);
   }

   deleteGroup(req, res, next) {
     CustomerGroupsService.deleteGroup(req.params.id)
      .then(data => { res.status(data ? 200 : 404).end() })
      .catch(next);
   }
}

module.exports = CustomerGroupsController;
