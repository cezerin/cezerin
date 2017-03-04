'use strict';

var SecurityTokensService = require('../services/security/tokens');

class SecurityTokensController {
  constructor(router) {
    this.router = router;
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get('/security/tokens', this.getTokens.bind(this));
    this.router.get('/security/tokens/blacklist', this.getTokensBlacklist.bind(this));
    this.router.post('/security/tokens', this.addToken.bind(this));
    this.router.get('/security/tokens/:id', this.getSingleToken.bind(this));
    this.router.put('/security/tokens/:id', this.updateToken.bind(this));
    this.router.delete('/security/tokens/:id', this.deleteToken.bind(this));
    this.router.post('/authorize', this.sendDashboardSigninUrl.bind(this));
  }

  getTokens(req, res, next) {
    SecurityTokensService.getTokens(req.query).then(data => {
      res.send(data)
    }).catch(next)
  }

  getTokensBlacklist(req, res, next) {
    SecurityTokensService.getTokensBlacklist().then(data => {
      res.send(data)
    }).catch(next)
  }

  getSingleToken(req, res, next) {
    SecurityTokensService.getSingleToken(req.params.id).then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).end()
      }
    }).catch(next)
  }

  addToken(req, res, next) {
    SecurityTokensService.addToken(req.body).then(data => {
      res.send(data)
    }).catch(next)
  }

  updateToken(req, res, next) {
    SecurityTokensService.updateToken(req.params.id, req.body).then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).end()
      }
    }).catch(next)
  }

  deleteToken(req, res, next) {
   SecurityTokensService.deleteToken(req.params.id)
    .then(data => { res.end() })
    .catch(next)
  }

   sendDashboardSigninUrl(req, res, next) {
     SecurityTokensService.sendDashboardSigninUrl(req.body.email).then(data => {
       res.send(data);
     }).catch(next)
   }
}

module.exports = SecurityTokensController;
