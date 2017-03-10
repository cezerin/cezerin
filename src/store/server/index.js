import winston from 'winston';
import express from 'express';
let storeRouter = express.Router();

import api from 'cezerin-client';
api.initAjax(clientSettings.ajaxBaseUrl);
api.init(serverSettings.apiBaseUrl, serverSettings.security.token);

import React from 'react'
import {match, RouterContext} from 'react-router'
import {renderToString} from 'react-dom/server'
import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {Provider} from 'react-redux'
import Helmet from 'react-helmet'
import createRoutes from '../shared/routes'
import reducers from '../shared/reducers'
import {getInitialState} from '../shared/actions'
import clientSettings from '../client/settings'
import serverSettings from './settings'
import { readIndexHtmlFile } from './theme.js'

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
  }
}

const renderHtml = (req, res, renderProps, store, templateHtml) => {
  const full_url = `${req.protocol}://${req.hostname}${req.url}`;
  const referrer_url = req.get('referrer') === undefined ? '' : req.get('referrer');

  const {location, params, history} = renderProps;
  const contentHtml = renderToString(
    <Provider store={store}>
      <RouterContext {...renderProps}/>
    </Provider>
  )

  const state = store.getState();
  const head = getHead();
  const html = templateHtml.replace('{language}', clientSettings.language).replace('{title}', head.title).replace('{meta}', head.meta).replace('{link}', head.link).replace('{script}', head.script).replace('{state}', JSON.stringify(state)).replace('{content}', contentHtml);

  if(!req.signedCookies.referrer_url) {
    res.cookie('referrer_url', referrer_url, serverSettings.referrerCookieOptions);
  }

  if(!req.signedCookies.landing_url) {
    res.cookie('landing_url', full_url, serverSettings.referrerCookieOptions);
  }

  res.status(200).send(html);
}

const sendPageNotFound = (res) => {
  res.status(404).send('Not found')
}

const sendPageError = (res, status, err) => {
  winston.error('Page error', err);
  res.status(status).send(err);
}

storeRouter.get('*', (req, res, next) => {
  Promise.all([
    readIndexHtmlFile(),
    api.sitemap.retrieve({ path: req.path, active: true }),
    api.checkout_fields.list()
  ]).then(([templateHtml, sitemapDetails, checkout_fields]) => {
    if (sitemapDetails.status === 200) {
      getInitialState(req, checkout_fields.json, sitemapDetails.json).then(initialState => {
        const store = createStore(reducers, initialState, applyMiddleware(thunkMiddleware));
        const routes = createRoutes(store);

        match({
          routes,
          location: req.path
        }, (error, redirectLocation, renderProps) => {
          if (error) {
            sendPageError(res, 500, error.message)
          } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search)
          } else if (renderProps) {
            renderHtml(req, res, renderProps, store, templateHtml);
          } else {
            sendPageNotFound(res)
          }
        });
      })
    } else if (sitemapDetails.status === 404) {
      sendPageNotFound(res);
    } else {
     sendPageError(res, sitemapDetails.status, sitemapDetails.json.message)
   }
 }).catch(err => {
   sendPageError(res, 500, err)
 });
});

module.exports = storeRouter;
