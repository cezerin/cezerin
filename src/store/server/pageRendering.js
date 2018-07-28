import winston from 'winston';
import CezerinClient from 'cezerin-client';
import React from 'react';
import { StaticRouter } from 'react-router';
import { renderToString } from 'react-dom/server';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import Helmet from 'react-helmet';
import { initOnServer } from 'theme';
import serverSettings from './settings';
import reducers from '../shared/reducers';
import { loadState } from './loadState';
import { indexHtml } from './readIndexHtml';
import App from '../shared/app';

initOnServer({
	language: serverSettings.language,
	api: new CezerinClient({
		ajaxBaseUrl: serverSettings.ajaxBaseUrl
	})
});

const getHead = () => {
	const helmet = Helmet.rewind();
	return {
		title: helmet.title.toString(),
		meta: helmet.meta.toString(),
		link: helmet.link.toString(),
		script: helmet.script.toString(),
		style: helmet.style.toString(),
		htmlAttributes: helmet.htmlAttributes.toString(),
		base: helmet.base.toString(),
		noscript: helmet.noscript.toString()
	};
};

const getReferrerCookieOptions = isHttps => ({
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	httpOnly: true,
	signed: true,
	secure: isHttps,
	sameSite: 'strict'
});

const renderError = (req, res, err) => {
	winston.error(
		`Error on page rendering\n\tpath: ${req.url}\n\terror: ${err.toString()}`
	);
	if (err.stack) {
		winston.error(err.stack);
	}
	res.status(500).send(err.message ? err.message : err);
};

const getAppHtml = (store, location, context = {}) => {
	const html = renderToString(
		<Provider store={store}>
			<StaticRouter location={location} context={context}>
				<App />
			</StaticRouter>
		</Provider>
	);

	return html;
};

const getPlaceholder = placeholders => {
	let placeholder = {
		head_start: '',
		head_end: '',
		body_start: '',
		body_end: ''
	};

	if (placeholders && placeholders.length > 0) {
		placeholder.head_start = placeholders
			.filter(p => p.place === 'head_start')
			.map(p => p.value)
			.join('\n');
		placeholder.head_end = placeholders
			.filter(p => p.place === 'head_end')
			.map(p => p.value)
			.join('\n');
		placeholder.body_start = placeholders
			.filter(p => p.place === 'body_start')
			.map(p => p.value)
			.join('\n');
		placeholder.body_end = placeholders
			.filter(p => p.place === 'body_end')
			.map(p => p.value)
			.join('\n');
	}

	return placeholder;
};

const renderPage = (req, res, store, themeText, placeholders) => {
	const appHtml = getAppHtml(store, req.url);
	const state = store.getState();
	const head = getHead();
	const placeholder = getPlaceholder(placeholders);

	const html = indexHtml
		.replace('{placeholder_head_start}', placeholder.head_start)
		.replace('{placeholder_head_end}', placeholder.head_end)
		.replace('{placeholder_body_start}', placeholder.body_start)
		.replace('{placeholder_body_end}', placeholder.body_end)
		.replace('{language}', serverSettings.language)
		.replace('{title}', head.title)
		.replace('{meta}', head.meta)
		.replace('{link}', head.link)
		.replace('{script}', head.script)
		.replace('{app_text}', JSON.stringify(themeText))
		.replace('{app_state}', JSON.stringify(state))
		.replace('{app}', appHtml);

	const isHttps = req.protocol === 'https';
	const full_url = `${req.protocol}://${req.hostname}${req.url}`;
	const referrer_url =
		req.get('referrer') === undefined ? '' : req.get('referrer');
	const REFERRER_COOKIE_OPTIONS = getReferrerCookieOptions(isHttps);

	if (!req.signedCookies.referrer_url) {
		res.cookie('referrer_url', referrer_url, REFERRER_COOKIE_OPTIONS);
	}

	if (!req.signedCookies.landing_url) {
		res.cookie('landing_url', full_url, REFERRER_COOKIE_OPTIONS);
	}

	const httpStatusCode = state.app.currentPage.type === 404 ? 404 : 200;
	res.status(httpStatusCode).send(html);
};

const pageRendering = (req, res) => {
	loadState(req, serverSettings.language)
		.then(({ state, themeText, placeholders }) => {
			initOnServer({
				themeSettings: state.app.themeSettings,
				text: themeText
			});
			const store = createStore(
				reducers,
				state,
				applyMiddleware(thunkMiddleware)
			);
			renderPage(req, res, store, themeText, placeholders);
		})
		.catch(err => {
			renderError(req, res, err);
		});
};

export default pageRendering;
