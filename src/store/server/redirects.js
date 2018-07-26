import api from './api';

const IGNORE_PATH = ['/'];

const getRedirect = req => {
	const absoluteUrl = `${req.protocol}://${req.hostname}${req.url}`;
	const relativeUrl = req.url;
	const relativePath = req.path;

	return api.redirects.list().then(({ status, json }) => {
		const items = json;
		if (items && items.length > 0) {
			/*
      1. check absolute url
      2. check relative url
      3. check relative url (without query)
      */
			const redirect = items.find(
				item =>
					item.from === absoluteUrl ||
					item.from === relativeUrl ||
					item.from === relativePath
			);
			return redirect;
		}

		return null;
	});
};

const redirectUrlIsValid = url => {
	return (
		url &&
		url.length > 0 &&
		(url.startsWith('/') ||
			url.startsWith('https://') ||
			url.startsWith('http://'))
	);
};

const redirects = (req, res, next) => {
	if (IGNORE_PATH.includes(req.url)) {
		next();
	} else {
		getRedirect(req)
			.then(redirect => {
				if (redirect && redirectUrlIsValid(redirect.to)) {
					res.redirect(redirect.status, redirect.to);
				} else {
					next();
				}
			})
			.catch(() => {
				next();
			});
	}
};

export default redirects;
