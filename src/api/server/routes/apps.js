import security from '../lib/security';
import AppSettingsService from '../services/apps/settings';

class AppsRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.get(
			'/v1/apps/:key/settings',
			security.checkUserScope.bind(this, security.scope.READ_SETTINGS),
			this.getSettings.bind(this)
		);
		this.router.put(
			'/v1/apps/:key/settings',
			security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
			this.updateSettings.bind(this)
		);
	}

	getSettings(req, res, next) {
		AppSettingsService.getSettings(req.params.key)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateSettings(req, res, next) {
		AppSettingsService.updateSettings(req.params.key, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}
}

export default AppsRoute;
