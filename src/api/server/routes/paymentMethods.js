import security from '../lib/security';
import PaymentMethodsService from '../services/orders/paymentMethods';

class PaymentMethodsRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.get(
			'/v1/payment_methods',
			security.checkUserScope.bind(this, security.scope.READ_PAYMENT_METHODS),
			this.getMethods.bind(this)
		);
		this.router.post(
			'/v1/payment_methods',
			security.checkUserScope.bind(this, security.scope.WRITE_PAYMENT_METHODS),
			this.addMethod.bind(this)
		);
		this.router.get(
			'/v1/payment_methods/:id',
			security.checkUserScope.bind(this, security.scope.READ_PAYMENT_METHODS),
			this.getSingleMethod.bind(this)
		);
		this.router.put(
			'/v1/payment_methods/:id',
			security.checkUserScope.bind(this, security.scope.WRITE_PAYMENT_METHODS),
			this.updateMethod.bind(this)
		);
		this.router.delete(
			'/v1/payment_methods/:id',
			security.checkUserScope.bind(this, security.scope.WRITE_PAYMENT_METHODS),
			this.deleteMethod.bind(this)
		);
	}

	getMethods(req, res, next) {
		PaymentMethodsService.getMethods(req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleMethod(req, res, next) {
		PaymentMethodsService.getSingleMethod(req.params.id)
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
		PaymentMethodsService.addMethod(req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateMethod(req, res, next) {
		PaymentMethodsService.updateMethod(req.params.id, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deleteMethod(req, res, next) {
		PaymentMethodsService.deleteMethod(req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}
}

export default PaymentMethodsRoute;
