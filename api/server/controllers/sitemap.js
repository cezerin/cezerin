'use strict';

var SitemapService = require('../services/sitemap');

class SitemapController {
  constructor(router) {
        this.router = router;
        this.registerRoutes();
  }

  registerRoutes() {
       this.router.get('/sitemap', this.getPaths.bind(this));
   }

   getPaths(req, res) {
     if(req.query.path) {
       SitemapService.getSinglePath(req.query.path)
        .then((data) => {
          if(data) {
            res.send(data)
          } else {
            res.status(404).end()
          }
        })
        .catch((err) => { res.status(500).send(err) });
     } else {
       SitemapService.getPaths()
        .then((data) => { res.send(data) })
        .catch((err) => { res.status(500).send(err) });
     }
   }
}

module.exports = SitemapController;
