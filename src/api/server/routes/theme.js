import security from '../lib/security';
import ThemeService from '../services/theme/theme';
import ThemeSettingsService from '../services/theme/settings';
import ThemeAssetsService from '../services/theme/assets';
import ThemePlaceholdersService from '../services/theme/placeholders';

class ThemeRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.get(
			'/v1/theme/export',
			security.checkUserScope.bind(this, security.scope.READ_THEME),
			this.exportTheme.bind(this)
		);
		this.router.post(
			'/v1/theme/install',
			security.checkUserScope.bind(this, security.scope.WRITE_THEME),
			this.installTheme.bind(this)
		);

		this.router.get(
			'/v1/theme/settings',
			security.checkUserScope.bind(this, security.scope.READ_THEME),
			this.getSettings.bind(this)
		);
		this.router.put(
			'/v1/theme/settings',
			security.checkUserScope.bind(this, security.scope.WRITE_THEME),
			this.updateSettings.bind(this)
		);
		this.router.get(
			'/v1/theme/settings_schema',
			security.checkUserScope.bind(this, security.scope.READ_THEME),
			this.getSettingsSchema.bind(this)
		);

		this.router.post(
			'/v1/theme/assets',
			security.checkUserScope.bind(this, security.scope.WRITE_THEME),
			this.uploadFile.bind(this)
		);
		this.router.delete(
			'/v1/theme/assets/:file',
			security.checkUserScope.bind(this, security.scope.WRITE_THEME),
			this.deleteFile.bind(this)
		);

		this.router.get(
			'/v1/theme/placeholders',
			security.checkUserScope.bind(this, security.scope.READ_THEME),
			this.getPlaceholders.bind(this)
		);
		this.router.post(
			'/v1/theme/placeholders',
			security.checkUserScope.bind(this, security.scope.WRITE_THEME),
			this.addPlaceholder.bind(this)
		);
		this.router.get(
			'/v1/theme/placeholders/:key',
			security.checkUserScope.bind(this, security.scope.READ_THEME),
			this.getSinglePlaceholder.bind(this)
		);
		this.router.put(
			'/v1/theme/placeholders/:key',
			security.checkUserScope.bind(this, security.scope.WRITE_THEME),
			this.updatePlaceholder.bind(this)
		);
		this.router.delete(
			'/v1/theme/placeholders/:key',
			security.checkUserScope.bind(this, security.scope.WRITE_THEME),
			this.deletePlaceholder.bind(this)
		);
	}

	exportTheme(req, res, next) {
		ThemeService.exportTheme(req, res);
	}

	installTheme(req, res, next) {
		ThemeService.installTheme(req, res);
	}

	getSettings(req, res, next) {
		ThemeSettingsService.getSettings()
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateSettings(req, res, next) {
		ThemeSettingsService.updateSettings(req.body)
			.then(() => {
				res.end();
			})
			.catch(next);
	}

	getSettingsSchema(req, res, next) {
		ThemeSettingsService.getSettingsSchema()
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	uploadFile(req, res, next) {
		ThemeAssetsService.uploadFile(req, res, next);
	}

	deleteFile(req, res, next) {
		ThemeAssetsService.deleteFile(req.params.file)
			.then(() => {
				res.end();
			})
			.catch(next);
	}

	getPlaceholders(req, res, next) {
		ThemePlaceholdersService.getPlaceholders()
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSinglePlaceholder(req, res, next) {
		ThemePlaceholdersService.getSinglePlaceholder(req.params.key)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addPlaceholder(req, res, next) {
		ThemePlaceholdersService.addPlaceholder(req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updatePlaceholder(req, res, next) {
		ThemePlaceholdersService.updatePlaceholder(req.params.key, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deletePlaceholder(req, res, next) {
		ThemePlaceholdersService.deletePlaceholder(req.params.key)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}
}

export default ThemeRoute;
