import security from '../lib/security';
import RedirectsService from '../services/redirects';

class RedirectsRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.get(
			'/v1/redirects',
			security.checkUserScope.bind(this, security.scope.READ_SETTINGS),
			this.getRedirects.bind(this)
		);
		this.router.post(
			'/v1/redirects',
			security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
			this.addRedirect.bind(this)
		);
		this.router.get(
			'/v1/redirects/:id',
			security.checkUserScope.bind(this, security.scope.READ_SETTINGS),
			this.getSingleRedirect.bind(this)
		);
		this.router.put(
			'/v1/redirects/:id',
			security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
			this.updateRedirect.bind(this)
		);
		this.router.delete(
			'/v1/redirects/:id',
			security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
			this.deleteRedirect.bind(this)
		);
	}

	getRedirects(req, res, next) {
		RedirectsService.getRedirects(req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleRedirect(req, res, next) {
		RedirectsService.getSingleRedirect(req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addRedirect(req, res, next) {
		RedirectsService.addRedirect(req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateRedirect(req, res, next) {
		RedirectsService.updateRedirect(req.params.id, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deleteRedirect(req, res, next) {
		RedirectsService.deleteRedirect(req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}
}

export default RedirectsRoute;
