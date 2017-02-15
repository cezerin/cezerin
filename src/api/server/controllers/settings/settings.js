'use strict';

var SettingsService = require('../../services/settings/settings');
var EmailSettingsService = require('../../services/settings/email');

class SettingsController {
  constructor(router) {
        this.router = router;
        this.registerRoutes();
  }

  registerRoutes() {
      this.router.get('/settings', this.getSettings.bind(this));
      this.router.put('/settings', this.updateSettings.bind(this));
      this.router.get('/settings/email', this.getEmailSettings.bind(this));
      this.router.put('/settings/email', this.updateEmailSettings.bind(this));
   }

   getSettings(req, res) {
     SettingsService.getSettings()
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   updateSettings(req, res) {
     SettingsService.updateSettings(req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getEmailSettings(req, res) {
     EmailSettingsService.getEmailSettings()
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   updateEmailSettings(req, res) {
     EmailSettingsService.updateEmailSettings(req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getErrorMessage(err) {
     return { 'error': true, 'message': err.toString() };
   }
}

module.exports = SettingsController;
