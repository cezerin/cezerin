'use strict';

var ThemesService = require('../services/themes/themes');

class ThemesController {
  constructor(router) {
    this.router = router;
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get('/themes/current/zip', this.exportCurrentTheme.bind(this));
    this.router.post('/themes/current/zip', this.installTheme.bind(this));
  }

  exportCurrentTheme(req, res, next) {
    ThemesService.exportCurrentTheme(req, res);
  }

  installTheme(req, res, next) {
    ThemesService.installTheme(req, res);
  }

}

module.exports = ThemesController;
