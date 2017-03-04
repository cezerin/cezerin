'use strict';

var PagesService = require('../services/pages/pages');

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

   getPages(req, res, next) {
     PagesService.getPages(req.query)
      .then(data => { res.send(data) })
      .catch(next);
   }

   getSinglePage(req, res, next) {
     PagesService.getSinglePage(req.params.id)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch(next);
   }

   addPage(req, res, next) {
     PagesService.addPage(req.body)
      .then(data => { res.send(data) })
      .catch(next);
   }


   updatePage(req, res, next) {
     PagesService.updatePage(req.params.id, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(next);
   }

   deletePage(req, res, next) {
     PagesService.deletePage(req.params.id)
      .then(data => { res.status(data ? 200 : 404).end() })
      .catch(next);
   }
}

module.exports = PagesController;
