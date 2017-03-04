'use strict';

var SettingsService = require('../services/settings/settings');
var EmailSettingsService = require('../services/settings/email');
var EmailTemplatesService = require('../services/settings/email_templates');
var CheckoutFieldsService = require('../services/settings/checkout_fields');

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
      this.router.get('/settings/email/templates/:name', this.getEmailTemplate.bind(this));
      this.router.put('/settings/email/templates/:name', this.updateEmailTemplate.bind(this));
      this.router.get('/settings/checkout/fields', this.getCheckoutFields.bind(this));
      this.router.get('/settings/checkout/fields/:name', this.getCheckoutField.bind(this));
      this.router.put('/settings/checkout/fields/:name', this.updateCheckoutField.bind(this));
   }

   getSettings(req, res, next) {
     SettingsService.getSettings()
      .then(data => { res.send(data) })
      .catch(next);
   }

   updateSettings(req, res, next) {
     SettingsService.updateSettings(req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(next);
   }

   getEmailSettings(req, res, next) {
     EmailSettingsService.getEmailSettings()
      .then(data => { res.send(data) })
      .catch(next);
   }

   updateEmailSettings(req, res, next) {
     EmailSettingsService.updateEmailSettings(req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(next);
   }

   getEmailTemplate(req, res, next) {
     EmailTemplatesService.getEmailTemplate(req.params.name)
      .then(data => { res.send(data) })
      .catch(next);
   }

   updateEmailTemplate(req, res, next) {
     EmailTemplatesService.updateEmailTemplate(req.params.name, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(next);
   }

   getCheckoutFields(req, res, next) {
     CheckoutFieldsService.getCheckoutFields()
      .then(data => { res.send(data) })
      .catch(next);
   }

   getCheckoutField(req, res, next) {
     CheckoutFieldsService.getCheckoutField(req.params.name)
      .then(data => { res.send(data) })
      .catch(next);
   }

   updateCheckoutField(req, res, next) {
     CheckoutFieldsService.updateCheckoutField(req.params.name, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(next);
   }
}

module.exports = SettingsController;
