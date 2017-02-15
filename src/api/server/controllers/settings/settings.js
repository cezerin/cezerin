'use strict';

var SettingsService = require('../../services/settings/settings');

class SettingsController {
  constructor(router) {
        this.router = router;
        this.registerRoutes();
  }

  registerRoutes() {
      this.router.get('/settings', this.getSettings.bind(this));
      this.router.put('/settings', this.updateSettings.bind(this));

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

   getErrorMessage(err) {
     return { 'error': true, 'message': err.toString() };
   }
}

module.exports = SettingsController;
