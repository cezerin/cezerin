import security from '../lib/security';
import OrderStatusesService from '../services/orders/orderStatuses';

class OrderStatusesRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.get(
			'/v1/order_statuses',
			security.checkUserScope.bind(this, security.scope.READ_ORDER_STATUSES),
			this.getStatuses.bind(this)
		);
		this.router.post(
			'/v1/order_statuses',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDER_STATUSES),
			this.addStatus.bind(this)
		);
		this.router.get(
			'/v1/order_statuses/:id',
			security.checkUserScope.bind(this, security.scope.READ_ORDER_STATUSES),
			this.getSingleStatus.bind(this)
		);
		this.router.put(
			'/v1/order_statuses/:id',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDER_STATUSES),
			this.updateStatus.bind(this)
		);
		this.router.delete(
			'/v1/order_statuses/:id',
			security.checkUserScope.bind(this, security.scope.WRITE_ORDER_STATUSES),
			this.deleteStatus.bind(this)
		);
	}

	getStatuses(req, res, next) {
		OrderStatusesService.getStatuses(req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleStatus(req, res, next) {
		OrderStatusesService.getSingleStatus(req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addStatus(req, res, next) {
		OrderStatusesService.addStatus(req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateStatus(req, res, next) {
		OrderStatusesService.updateStatus(req.params.id, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deleteStatus(req, res, next) {
		OrderStatusesService.deleteStatus(req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}
}

export default OrderStatusesRoute;
