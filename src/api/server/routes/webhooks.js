import security from '../lib/security';
import WebhooksService from '../services/webhooks';

class WebhooksRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.get(
			'/v1/webhooks',
			security.checkUserScope.bind(this, security.scope.READ_SETTINGS),
			this.getWebhooks.bind(this)
		);
		this.router.post(
			'/v1/webhooks',
			security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
			this.addWebhook.bind(this)
		);
		this.router.get(
			'/v1/webhooks/:id',
			security.checkUserScope.bind(this, security.scope.READ_SETTINGS),
			this.getSingleWebhook.bind(this)
		);
		this.router.put(
			'/v1/webhooks/:id',
			security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
			this.updateWebhook.bind(this)
		);
		this.router.delete(
			'/v1/webhooks/:id',
			security.checkUserScope.bind(this, security.scope.WRITE_SETTINGS),
			this.deleteWebhook.bind(this)
		);
	}

	getWebhooks(req, res, next) {
		WebhooksService.getWebhooks(req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleWebhook(req, res, next) {
		WebhooksService.getSingleWebhook(req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addWebhook(req, res, next) {
		WebhooksService.addWebhook(req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateWebhook(req, res, next) {
		WebhooksService.updateWebhook(req.params.id, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deleteWebhook(req, res, next) {
		WebhooksService.deleteWebhook(req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}
}

export default WebhooksRoute;
