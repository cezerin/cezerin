import express from 'express';
let storeRouter = express.Router();

import api from 'cezerin-client';
api.initAjax(clientSettings.ajaxBaseUrl);

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
import * as theme from './theme.js'

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

const referrerCookieOptions = {
  maxAge: 604800000,
  httpOnly: true,
  signed: true,
  sameSite: 'strict'
}

storeRouter.get('*', (req, res, next) => {
  const full_url = `${req.protocol}://${req.hostname}${req.url}`;
  const referrer_url = req.get('referrer') === undefined ? '' : req.get('referrer');

  theme.readBuildManifest().then(buildManifestJSON => {
    theme.readTemplate().then(templateHtml => {
      getInitialState(req).then(initialState => {
        if (initialState) {
          const store = createStore(reducers, initialState, applyMiddleware(thunkMiddleware));
          const routes = createRoutes(store);

          match({
            routes,
            location: req.url
          }, (error, redirectLocation, renderProps) => {
            if (error) {
              res.status(500).send(error.message)
            } else if (redirectLocation) {
              res.redirect(302, redirectLocation.pathname + redirectLocation.search)
            } else if (renderProps) {

              const {location, params, history} = renderProps;
              const contentHtml = renderToString(
                <Provider store={store}>
                  <RouterContext {...renderProps}/>
                </Provider>
              )

              const state = store.getState();
              const head = getHead();
              const html = templateHtml.replace('{app.js}', buildManifestJSON['app.js']).replace('{theme.js}', buildManifestJSON['theme.js']).replace('{title}', head.title).replace('{meta}', head.meta).replace('{link}', head.link).replace('{script}', head.script).replace('{state}', JSON.stringify(state)).replace('{content}', contentHtml);

              if(!req.signedCookies.referrer_url) {
                res.cookie('referrer_url', referrer_url, referrerCookieOptions);
              }

              if(!req.signedCookies.landing_url) {
                res.cookie('landing_url', full_url, referrerCookieOptions);
              }

              res.status(200).send(html);
            } else {
              res.status(404).send('Not found')
            }
          });

        } else {
          res.status(404).send('Not found')
        }
      })
    }).catch(err => {
      res.status(500).send(err)
    });
  }).catch(err => {
    res.status(500).send(err)
  });

});

module.exports = storeRouter;
