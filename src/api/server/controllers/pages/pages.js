'use strict';

var PagesService = require('../../services/pages/pages');

class PagesController {
  constructor(router) {
        this.router = router;
        this.registerRoutes();
  }

  registerRoutes() {
       this.router.get('/pages', this.getPages.bind(this));
       this.router.post('/pages', this.addPage.bind(this));
       this.router.get('/pages/:id', this.getSinglePage.bind(this));
       this.router.put('/pages/:id', this.updatePage.bind(this));
       this.router.delete('/pages/:id', this.deletePage.bind(this));
   }

   getPages(req, res) {
     PagesService.getPages(req.query)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getSinglePage(req, res) {
     PagesService.getSinglePage(req.params.id)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   addPage(req, res) {
     PagesService.addPage(req.body)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }


   updatePage(req, res) {
     PagesService.updatePage(req.params.id, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   deletePage(req, res) {
     PagesService.deletePage(req.params.id)
      .then(data => { res.end() })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getErrorMessage(err) {
     return { 'error': true, 'message': err.toString() };
   }
}

module.exports = PagesController;
