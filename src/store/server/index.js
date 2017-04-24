import winston from 'winston';
import express from 'express';
let storeRouter = express.Router();
import serverSettings from './settings'

import jwt from 'jsonwebtoken';
const TOKEN_PAYLOAD = {email: 'store', scopes: ['admin']};
const STORE_ACCESS_TOKEN = jwt.sign(TOKEN_PAYLOAD, serverSettings.jwtSecretKey);

import api from 'cezerin-client';
api.initAjax(serverSettings.ajaxBaseUrl);
api.init(serverSettings.apiBaseUrl, STORE_ACCESS_TOKEN);

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
import { readIndexHtmlFile } from './theme.js'
import sm from 'sitemap'

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

const getReferrerCookieOptions = (isHttps) => ({
  maxAge: 604800000,
  httpOnly: true,
  signed: true,
  secure: isHttps,
  sameSite: 'strict'
})

const renderHtml = (req, res, renderProps, store, templateHtml, httpStatusCode) => {
  const full_url = `${req.protocol}://${req.hostname}${req.url}`;
  const isHttps = req.protocol === 'https';
  const REFERRER_COOKIE_OPTIONS = getReferrerCookieOptions(isHttps);
  const referrer_url = req.get('referrer') === undefined ? '' : req.get('referrer');

  const {location, params, history} = renderProps;
  const contentHtml = renderToString(
    <Provider store={store}>
      <RouterContext {...renderProps}/>
    </Provider>
  )

  const state = store.getState();
  const head = getHead();
  const html = templateHtml
  .replace('{language}', serverSettings.language)
  .replace('{title}', head.title).replace('{meta}', head.meta).replace('{link}', head.link)
  .replace('{script}', head.script).replace('{state}', JSON.stringify(state)).replace('{content}', contentHtml);

  if(!req.signedCookies.referrer_url) {
    res.cookie('referrer_url', referrer_url, REFERRER_COOKIE_OPTIONS);
  }

  if(!req.signedCookies.landing_url) {
    res.cookie('landing_url', full_url, REFERRER_COOKIE_OPTIONS);
  }

  res.status(httpStatusCode).send(html);
}

const sendPageError = (res, status, err) => {
  winston.error('Page error', err);
  res.status(status).send(err);
}

storeRouter.get('/sitemap.xml', (req, res) => {
  Promise.all([
    api.sitemap.list(),
    api.settings.retrieve()
  ]).then(([sitemapResponse, settingsResponse]) => {
    const urls = sitemapResponse.json.filter(item => item.type !== 'reserved' && item.type !== 'search').map(item => item.path)
    const sitemap = sm.createSitemap ({
      hostname: settingsResponse.json.domain,
      urls: urls
    });
    sitemap.toXML((err, xml) => {
      if (err) {
        return res.status(500).end();
      }
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    });
  })
});

storeRouter.get('*', (req, res, next) => {
  Promise.all([
    readIndexHtmlFile(),
    api.sitemap.retrieve({ path: req.path, enabled: true }),
    api.checkoutFields.list(),
    api.settings.retrieve()
  ]).then(([templateHtml, sitemapDetails, checkoutFields, settings]) => {
    if (sitemapDetails.status === 200 || sitemapDetails.status === 404) {
      let currentPage = sitemapDetails.json;
      if(sitemapDetails.status === 404) {
        currentPage = {
          type: 404,
          resource: null
        }
      }

      getInitialState(req, checkoutFields.json, currentPage, settings.json).then(initialState => {
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
            renderHtml(req, res, renderProps, store, templateHtml, sitemapDetails.status);
          } else {
            winston.error('Route not found', req.path);
          }
        });
      })
    } else {
     sendPageError(res, sitemapDetails.status, sitemapDetails.json.message)
   }
 }).catch(err => {
   sendPageError(res, 500, err)
 });
});

module.exports = storeRouter;
