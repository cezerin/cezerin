import security from '../lib/security';
import SitemapService from '../services/sitemap';

class SitemapRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.get(
			'/v1/sitemap',
			security.checkUserScope.bind(this, security.scope.READ_SITEMAP),
			this.getPaths.bind(this)
		);
	}

	getPaths(req, res, next) {
		if (req.query.path) {
			SitemapService.getSinglePath(req.query.path, req.query.enabled)
				.then(data => {
					if (data) {
						res.send(data);
					} else {
						res.status(404).end();
					}
				})
				.catch(next);
		} else {
			SitemapService.getPaths(req.query.enabled)
				.then(data => {
					res.send(data);
				})
				.catch(next);
		}
	}
}

export default SitemapRoute;
