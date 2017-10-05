'use strict';

const security = require('../lib/security');
var ThemeService = require('../services/theme/theme');
var ThemeSettingsService = require('../services/theme/settings');

class ThemeController {
  constructor(router) {
    this.router = router;
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get('/v1/theme/export', security.checkUserScope.bind(this, security.scope.READ_THEME), this.exportTheme.bind(this));
    this.router.post('/v1/theme/install', security.checkUserScope.bind(this, security.scope.WRITE_THEME), this.installTheme.bind(this));

    this.router.get('/v1/theme/settings', security.checkUserScope.bind(this, security.scope.READ_THEME), this.getSettings.bind(this));
    this.router.put('/v1/theme/settings', security.checkUserScope.bind(this, security.scope.WRITE_THEME), this.updateSettings.bind(this));
    this.router.get('/v1/theme/settings_schema', security.checkUserScope.bind(this, security.scope.READ_THEME), this.getSettingsSchema.bind(this));
  }

  exportTheme(req, res, next) {
    ThemeService.exporTheme(req, res);
  }

  installTheme(req, res, next) {
    ThemeService.installTheme(req, res);
  }

  getSettings(req, res, next) {
    ThemeSettingsService.getSettings().then(data => {
      res.send(data)
    }).catch(next)
  }

  updateSettings(req, res, next) {
    ThemeSettingsService.updateSettings(req.body).then(() => {
      res.end();
    }).catch(next)
  }

  getSettingsSchema(req, res, next) {
    ThemeSettingsService.getSettingsSchema().then(data => {
      res.send(data)
    }).catch(next)
  }
}

module.exports = ThemeController;
