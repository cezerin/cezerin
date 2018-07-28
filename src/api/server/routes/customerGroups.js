import security from '../lib/security';
import CustomerGroupsService from '../services/customers/customerGroups';

class CustomerGroupsRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.get(
			'/v1/customer_groups',
			security.checkUserScope.bind(this, security.scope.READ_CUSTOMER_GROUPS),
			this.getGroups.bind(this)
		);
		this.router.post(
			'/v1/customer_groups',
			security.checkUserScope.bind(this, security.scope.WRITE_CUSTOMER_GROUPS),
			this.addGroup.bind(this)
		);
		this.router.get(
			'/v1/customer_groups/:id',
			security.checkUserScope.bind(this, security.scope.READ_CUSTOMER_GROUPS),
			this.getSingleGroup.bind(this)
		);
		this.router.put(
			'/v1/customer_groups/:id',
			security.checkUserScope.bind(this, security.scope.WRITE_CUSTOMER_GROUPS),
			this.updateGroup.bind(this)
		);
		this.router.delete(
			'/v1/customer_groups/:id',
			security.checkUserScope.bind(this, security.scope.WRITE_CUSTOMER_GROUPS),
			this.deleteGroup.bind(this)
		);
	}

	getGroups(req, res, next) {
		CustomerGroupsService.getGroups(req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleGroup(req, res, next) {
		CustomerGroupsService.getSingleGroup(req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addGroup(req, res, next) {
		CustomerGroupsService.addGroup(req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateGroup(req, res, next) {
		CustomerGroupsService.updateGroup(req.params.id, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deleteGroup(req, res, next) {
		CustomerGroupsService.deleteGroup(req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}
}

export default CustomerGroupsRoute;
