'use strict';

var CustomerGroupsService = require('../../services/customers/customer_groups');

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

   getGroups(req, res) {
     CustomerGroupsService.getGroups(req.query)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getSingleGroup(req, res) {
     CustomerGroupsService.getSingleGroup(req.params.id)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   addGroup(req, res) {
     CustomerGroupsService.addGroup(req.body)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }


   updateGroup(req, res) {
     CustomerGroupsService.updateGroup(req.params.id, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   deleteGroup(req, res) {
     CustomerGroupsService.deleteGroup(req.params.id)
      .then(data => { res.end() })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getErrorMessage(err) {
     return { 'error': true, 'message': err.toString() };
   }
}

module.exports = CustomerGroupsController;
