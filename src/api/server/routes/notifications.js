import PaymentGateways from '../paymentGateways';

class NotificationsRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.post(
			'/v1/notifications/:gateway',
			this.paymentNotification.bind(this)
		);
	}

	paymentNotification(req, res, next) {
		PaymentGateways.paymentNotification(req, res, req.params.gateway);
	}
}

export default NotificationsRoute;
