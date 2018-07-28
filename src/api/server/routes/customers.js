import security from '../lib/security';
import CustomersService from '../services/customers/customers';

class CustomersRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.get(
			'/v1/customers',
			security.checkUserScope.bind(this, security.scope.READ_CUSTOMERS),
			this.getCustomers.bind(this)
		);
		this.router.post(
			'/v1/customers',
			security.checkUserScope.bind(this, security.scope.WRITE_CUSTOMERS),
			this.addCustomer.bind(this)
		);
		this.router.get(
			'/v1/customers/:id',
			security.checkUserScope.bind(this, security.scope.READ_CUSTOMERS),
			this.getSingleCustomer.bind(this)
		);
		this.router.put(
			'/v1/customers/:id',
			security.checkUserScope.bind(this, security.scope.WRITE_CUSTOMERS),
			this.updateCustomer.bind(this)
		);
		this.router.delete(
			'/v1/customers/:id',
			security.checkUserScope.bind(this, security.scope.WRITE_CUSTOMERS),
			this.deleteCustomer.bind(this)
		);
		this.router.post(
			'/v1/customers/:id/addresses',
			security.checkUserScope.bind(this, security.scope.WRITE_CUSTOMERS),
			this.addAddress.bind(this)
		);
		this.router.put(
			'/v1/customers/:id/addresses/:address_id',
			security.checkUserScope.bind(this, security.scope.WRITE_CUSTOMERS),
			this.updateAddress.bind(this)
		);
		this.router.delete(
			'/v1/customers/:id/addresses/:address_id',
			security.checkUserScope.bind(this, security.scope.WRITE_CUSTOMERS),
			this.deleteAddress.bind(this)
		);
		this.router.post(
			'/v1/customers/:id/addresses/:address_id/default_billing',
			security.checkUserScope.bind(this, security.scope.WRITE_CUSTOMERS),
			this.setDefaultBilling.bind(this)
		);
		this.router.post(
			'/v1/customers/:id/addresses/:address_id/default_shipping',
			security.checkUserScope.bind(this, security.scope.WRITE_CUSTOMERS),
			this.setDefaultShipping.bind(this)
		);
	}

	getCustomers(req, res, next) {
		CustomersService.getCustomers(req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleCustomer(req, res, next) {
		CustomersService.getSingleCustomer(req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addCustomer(req, res, next) {
		CustomersService.addCustomer(req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateCustomer(req, res, next) {
		CustomersService.updateCustomer(req.params.id, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deleteCustomer(req, res, next) {
		CustomersService.deleteCustomer(req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}

	addAddress(req, res, next) {
		const customer_id = req.params.id;
		CustomersService.addAddress(customer_id, req.body)
			.then(data => {
				res.end();
			})
			.catch(next);
	}

	updateAddress(req, res, next) {
		const customer_id = req.params.id;
		const address_id = req.params.address_id;
		CustomersService.updateAddress(customer_id, address_id, req.body)
			.then(data => {
				res.end();
			})
			.catch(next);
	}

	deleteAddress(req, res, next) {
		const customer_id = req.params.id;
		const address_id = req.params.address_id;
		CustomersService.deleteAddress(customer_id, address_id)
			.then(data => {
				res.end();
			})
			.catch(next);
	}

	setDefaultBilling(req, res, next) {
		const customer_id = req.params.id;
		const address_id = req.params.address_id;
		CustomersService.setDefaultBilling(customer_id, address_id)
			.then(data => {
				res.end();
			})
			.catch(next);
	}

	setDefaultShipping(req, res, next) {
		const customer_id = req.params.id;
		const address_id = req.params.address_id;
		CustomersService.setDefaultShipping(customer_id, address_id)
			.then(data => {
				res.end();
			})
			.catch(next);
	}
}

export default CustomersRoute;
