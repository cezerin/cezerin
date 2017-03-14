'use strict';

const security = require('../lib/security');
var PagesService = require('../services/pages/pages');

class PagesController {
  constructor(router) {
    this.router = router;
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get('/pages', security.checkUserScope.bind(this, security.scope.READ_PAGES), this.getPages.bind(this));
    this.router.post('/pages', security.checkUserScope.bind(this, security.scope.WRITE_PAGES), this.addPage.bind(this));
    this.router.get('/pages/:id', security.checkUserScope.bind(this, security.scope.READ_PAGES), this.getSinglePage.bind(this));
    this.router.put('/pages/:id', security.checkUserScope.bind(this, security.scope.WRITE_PAGES), this.updatePage.bind(this));
    this.router.delete('/pages/:id', security.checkUserScope.bind(this, security.scope.WRITE_PAGES), this.deletePage.bind(this));
  }

  getPages(req, res, next) {
    PagesService.getPages(req.query).then(data => {
      res.send(data)
    }).catch(next);
  }

  getSinglePage(req, res, next) {
    PagesService.getSinglePage(req.params.id).then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).end()
      }
    }).catch(next);
  }

  addPage(req, res, next) {
    PagesService.addPage(req.body).then(data => {
      res.send(data)
    }).catch(next);
  }

  updatePage(req, res, next) {
    PagesService.updatePage(req.params.id, req.body).then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).end()
      }
    }).catch(next);
  }

  deletePage(req, res, next) {
    PagesService.deletePage(req.params.id).then(data => {
      res.status(data
        ? 200
        : 404).end()
    }).catch(next);
  }
}

module.exports = PagesController;
