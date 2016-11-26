var express = require('express');
var storeRouter = express.Router();

var api = require('cezerin-client');
api.init("http://localhost/api/", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNDc0OTgxNTE1fQ.dEyqeTPqFErKqoFKXTi6joNMn8UHgTvGWsjNMHJ7owY");

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
//import settings from 'server/settings'

storeRouter.get('*', (req, res, next) => {
  match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
    if (error) {
          res.status(500).send(error.message)
        } else if (redirectLocation) {
          res.redirect(302, redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {


          const slug = req.url === '/' ? '' : req.url.slice(1);
          api.sitemap.retrieve(slug).then(sitemapResponse => {
            if(sitemapResponse.json) {

              api.products.categories.list().then(({status, json}) => {
                const initialState = {
                  productCategories: {
                    categories: json
                  }
                }

                const store = createStore(reducers, initialState, applyMiddleware(thunkMiddleware));
                const {location, params, history} = renderProps

                const contentHtml = renderToString(
                  <Provider store={store}>
                    <RouterContext {...renderProps}/>
                  </Provider>
                )

                const helmet = Helmet.rewind();
                const state = store.getState()
                const head = {
                  title: helmet.title.toString(),
                  meta: helmet.meta.toString(),
                  link: helmet.link.toString(),
                  script: helmet.script.toString(),
                  style: helmet.style.toString(),
                  htmlAttributes: helmet.htmlAttributes.toString(),
                  base: helmet.base.toString(),
                  noscript: helmet.noscript.toString()
                };

                const pageHtml = Template({ settings: {}, state, head, contentHtml });
                res.status(200).send(pageHtml);
              })

            } else {
              res.status(404).send('Not found')
            }
          });
        } else {
          res.status(404).send('Not found')
        }
  });
})

module.exports = storeRouter;
