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
import Template from './template'
import {getInitialState} from '../shared/actions'
import clientSettings from '../client/settings'

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

storeRouter.get('*', (req, res, next) => {
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

          const state = store.getState()
          const head = getHead()

          const html = Template({settings: {}, state, head, contentHtml});
          res.status(200).send(html);

        } else {
          res.status(404).send('Not found')
        }
      });

    } else {
      res.status(404).send('Not found')
    }
  });

});

module.exports = storeRouter;
