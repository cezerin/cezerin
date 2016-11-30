import express from 'express';
let storeRouter = express.Router();

import React from 'react'
import {match} from 'react-router'
import {renderToString} from 'react-dom/server'
import {RouterContext} from 'react-router'
import {createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import {Provider} from 'react-redux'
import Helmet from 'react-helmet'
import {routes} from '../shared/routes'
import reducers from '../shared/reducers'
import Template from './template'
import {getInitialState} from '../shared/actions'
import clientSettings from '../client/settings'
import api from 'cezerin-client';
api.initAjax(clientSettings.ajaxBaseUrl);

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
  match({
    routes,
    location: req.url
  }, (error, redirectLocation, renderProps) => {
    if (error) {
      res.status(500).send(error.message)
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      getInitialState(req).then(initialState => {
        console.log(initialState);
        if (initialState) {

          const store = createStore(reducers, initialState, applyMiddleware(thunkMiddleware));
          const {location, params, history} = renderProps

          const contentHtml = renderToString(
            <Provider store={store}>
              <RouterContext {...renderProps}/>
            </Provider>
          )

          const state = store.getState()
          const head = getHead()

          const pageHtml = Template({settings: {}, state, head, contentHtml});
          res.status(200).send(pageHtml);

        } else {
          res.status(404).send('Not found')
        }
      })
    } else {
      res.status(404).send('Not found')
    }
  });
})

module.exports = storeRouter;
