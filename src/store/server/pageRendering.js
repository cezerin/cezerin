import winston from 'winston'
import serverSettings from './settings'
import api from 'cezerin-client'
import React from 'react'

import { StaticRouter } from 'react-router'
import {renderToString} from 'react-dom/server'
import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {Provider} from 'react-redux'
import Helmet from 'react-helmet'
import reducers from '../shared/reducers'
import { loadState } from './loadState'
import { indexHtml } from './readIndexHtml'
import App from '../shared/app'

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
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
  signed: true,
  secure: isHttps,
  sameSite: 'strict'
})

const renderError = (req, res, status, err) => {
  winston.error('Page error', req.url, err);
  res.status(status).send(err);
}

const renderPage = (req, res, store) => {
   const context = {}
   const appHtml = renderToString(
     <Provider store={store}>
       <StaticRouter
         location={req.url}
         context={context}
       >
         <App/>
       </StaticRouter>
     </Provider>
   )

  const state = store.getState();
  const head = getHead();
  const html = indexHtml
    .replace('{language}', serverSettings.language)
    .replace('{title}', head.title).replace('{meta}', head.meta).replace('{link}', head.link)
    .replace('{script}', head.script).replace('{state}', JSON.stringify(state)).replace('{app}', appHtml);

  const isHttps = req.protocol === 'https';
  const full_url = `${req.protocol}://${req.hostname}${req.url}`;
  const referrer_url = req.get('referrer') === undefined ? '' : req.get('referrer');
  const REFERRER_COOKIE_OPTIONS = getReferrerCookieOptions(isHttps);

  if(!req.signedCookies.referrer_url) {
    res.cookie('referrer_url', referrer_url, REFERRER_COOKIE_OPTIONS);
  }

  if(!req.signedCookies.landing_url) {
    res.cookie('landing_url', full_url, REFERRER_COOKIE_OPTIONS);
  }

  const httpStatusCode = state.app.currentPage.type === 404 ? 404 : 200;
  res.status(httpStatusCode).send(html);
}

const pageRendering = (req, res) => {
  loadState(req)
  .then(state => {
    const store = createStore(reducers, state, applyMiddleware(thunkMiddleware));
    renderPage(req, res, store);
  })
  .catch(err => {
    renderError(req, res, 500, err)
  });
}

export default pageRendering;
