import security from '../lib/security';
import ShippingMethodsService from '../services/orders/shippingMethods';

class ShippingMethodsRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.get(
			'/v1/shipping_methods',
			security.checkUserScope.bind(this, security.scope.READ_SHIPPING_METHODS),
			this.getMethods.bind(this)
		);
		this.router.post(
			'/v1/shipping_methods',
			security.checkUserScope.bind(this, security.scope.WRITE_SHIPPING_METHODS),
			this.addMethod.bind(this)
		);
		this.router.get(
			'/v1/shipping_methods/:id',
			security.checkUserScope.bind(this, security.scope.READ_SHIPPING_METHODS),
			this.getSingleMethod.bind(this)
		);
		this.router.put(
			'/v1/shipping_methods/:id',
			security.checkUserScope.bind(this, security.scope.WRITE_SHIPPING_METHODS),
			this.updateMethod.bind(this)
		);
		this.router.delete(
			'/v1/shipping_methods/:id',
			security.checkUserScope.bind(this, security.scope.WRITE_SHIPPING_METHODS),
			this.deleteMethod.bind(this)
		);
	}

	getMethods(req, res, next) {
		ShippingMethodsService.getMethods(req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleMethod(req, res, next) {
		ShippingMethodsService.getSingleMethod(req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addMethod(req, res, next) {
		ShippingMethodsService.addMethod(req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateMethod(req, res, next) {
		ShippingMethodsService.updateMethod(req.params.id, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	async deleteMethod(req, res, next) {
		const result = await ShippingMethodsService.deleteMethod(req.params.id);
		res.status(result ? 200 : 404).end();
	}
}

export default ShippingMethodsRoute;
