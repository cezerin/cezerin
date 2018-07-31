import security from '../lib/security';
import SecurityTokensService from '../services/security/tokens';

class SecurityTokensRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.get(
			'/v1/security/tokens',
			security.checkUserScope.bind(this, security.scope.ADMIN),
			this.getTokens.bind(this)
		);
		this.router.get(
			'/v1/security/tokens/blacklist',
			security.checkUserScope.bind(this, security.scope.ADMIN),
			this.getTokensBlacklist.bind(this)
		);
		this.router.post(
			'/v1/security/tokens',
			security.checkUserScope.bind(this, security.scope.ADMIN),
			this.addToken.bind(this)
		);
		this.router.get(
			'/v1/security/tokens/:id',
			security.checkUserScope.bind(this, security.scope.ADMIN),
			this.getSingleToken.bind(this)
		);
		this.router.put(
			'/v1/security/tokens/:id',
			security.checkUserScope.bind(this, security.scope.ADMIN),
			this.updateToken.bind(this)
		);
		this.router.delete(
			'/v1/security/tokens/:id',
			security.checkUserScope.bind(this, security.scope.ADMIN),
			this.deleteToken.bind(this)
		);
		this.router.post('/v1/authorize', this.sendDashboardSigninUrl.bind(this));
	}

	getTokens(req, res, next) {
		SecurityTokensService.getTokens(req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getTokensBlacklist(req, res, next) {
		SecurityTokensService.getTokensBlacklist()
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleToken(req, res, next) {
		SecurityTokensService.getSingleToken(req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addToken(req, res, next) {
		SecurityTokensService.addToken(req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateToken(req, res, next) {
		SecurityTokensService.updateToken(req.params.id, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deleteToken(req, res, next) {
		SecurityTokensService.deleteToken(req.params.id)
			.then(data => {
				res.end();
			})
			.catch(next);
	}

	sendDashboardSigninUrl(req, res, next) {
		SecurityTokensService.sendDashboardSigninUrl(req)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}
}

export default SecurityTokensRoute;
