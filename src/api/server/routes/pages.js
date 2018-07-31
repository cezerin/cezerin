import security from '../lib/security';
import PagesService from '../services/pages/pages';

class PagesRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.get(
			'/v1/pages',
			security.checkUserScope.bind(this, security.scope.READ_PAGES),
			this.getPages.bind(this)
		);
		this.router.post(
			'/v1/pages',
			security.checkUserScope.bind(this, security.scope.WRITE_PAGES),
			this.addPage.bind(this)
		);
		this.router.get(
			'/v1/pages/:id',
			security.checkUserScope.bind(this, security.scope.READ_PAGES),
			this.getSinglePage.bind(this)
		);
		this.router.put(
			'/v1/pages/:id',
			security.checkUserScope.bind(this, security.scope.WRITE_PAGES),
			this.updatePage.bind(this)
		);
		this.router.delete(
			'/v1/pages/:id',
			security.checkUserScope.bind(this, security.scope.WRITE_PAGES),
			this.deletePage.bind(this)
		);
	}

	getPages(req, res, next) {
		PagesService.getPages(req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSinglePage(req, res, next) {
		PagesService.getSinglePage(req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addPage(req, res, next) {
		PagesService.addPage(req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updatePage(req, res, next) {
		PagesService.updatePage(req.params.id, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deletePage(req, res, next) {
		PagesService.deletePage(req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}
}

export default PagesRoute;
