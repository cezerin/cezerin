'use strict';

var SecurityTokensService = require('../../services/security/tokens');

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

  getTokens(req, res) {
    SecurityTokensService.getTokens(req.query).then(data => {
      res.send(data)
    }).catch(err => {
      res.status(500).send(this.getErrorMessage(err))
    });
  }

  getTokensBlacklist(req, res) {
    SecurityTokensService.getTokensBlacklist(req.query).then(data => {
      res.send(data)
    }).catch(err => {
      res.status(500).send(this.getErrorMessage(err))
    });
  }

  getSingleToken(req, res) {
    SecurityTokensService.getSingleToken(req.params.id).then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).end()
      }
    }).catch(err => {
      res.status(500).send(this.getErrorMessage(err))
    });
  }

  addToken(req, res) {
    SecurityTokensService.addToken(req.body).then(data => {
      res.send(data)
    }).catch(err => {
      res.status(500).send(this.getErrorMessage(err))
    });
  }

  updateToken(req, res) {
    SecurityTokensService.updateToken(req.params.id, req.body).then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).end()
      }
    }).catch(err => {
      res.status(500).send(this.getErrorMessage(err))
    });
  }

  deleteToken(req, res) {
   SecurityTokensService.deleteToken(req.params.id)
    .then(data => { res.end() })
    .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
  }

   sendDashboardSigninUrl(req, res) {
     SecurityTokensService.sendDashboardSigninUrl(req.body.email).then(data => {
       res.send(data);
     }).catch(err => {
       res.status(500).send(this.getErrorMessage(err))
     });
   }

  getErrorMessage(err) {
    return {'error': true, 'message': err.toString()};
  }
}

module.exports = SecurityTokensController;
