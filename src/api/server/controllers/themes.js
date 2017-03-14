'use strict';

const security = require('../lib/security');
var ThemesService = require('../services/themes/themes');

class ThemesController {
  constructor(router) {
    this.router = router;
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get('/themes/current/zip', security.checkUserScope.bind(this, security.scope.READ_THEMES), this.exportCurrentTheme.bind(this));
    this.router.post('/themes/current/zip', security.checkUserScope.bind(this, security.scope.WRITE_THEMES), this.installTheme.bind(this));
  }

  exportCurrentTheme(req, res, next) {
    ThemesService.exportCurrentTheme(req, res);
  }

  installTheme(req, res, next) {
    ThemesService.installTheme(req, res);
  }

}

module.exports = ThemesController;
