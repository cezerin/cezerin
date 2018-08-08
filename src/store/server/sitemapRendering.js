import sm from 'sitemap';
import winston from 'winston';
import api from './api';

const SITEMAP_EXCLUDE_PATH = [
	'/',
	'/checkout',
	'/checkout-success',
	'/account',
	'/cart',
	'/login',
	'/logout',
	'/register'
];

const sitemapRendering = (req, res) => {
	Promise.all([
		api.sitemap.list({ enabled: true }),
		api.settings.retrieve()
	]).then(([sitemapResponse, settingsResponse]) => {
		const sitemapArray = sitemapResponse.json;
		const settings = settingsResponse.json;
		const hostname =
			settings.domain && settings.domain.length > 0
				? settings.domain
				: `${req.protocol}://${req.hostname}`;

		const urls = sitemapArray
			.filter(
				item =>
					item.type !== 'reserved' &&
					item.type !== 'search' &&
					!SITEMAP_EXCLUDE_PATH.includes(item.path)
			)
			.map(item => item.path);
		const sitemap = sm.createSitemap({ hostname, urls });
		sitemap.toXML((err, xml) => {
			if (err) {
				winston.error(err.message ? err.message : err);
				res.status(500).end();
			} else {
				res.header('Content-Type', 'application/xml');
				res.send(xml);
			}
		});
	});
};

export default sitemapRendering;
