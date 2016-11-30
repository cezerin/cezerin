import React from 'react'
import {Route, IndexRoute} from 'react-router'
import Helmet from "react-helmet";
import clientSettings from '../client/settings'
import {fetchProduct, setCategory, receiveSitemap} from './actions'
import api from 'cezerin-client';
api.initAjax(clientSettings.ajaxBaseUrl);

import IndexLayout from './layouts/index'
import SharedLayout from './layouts/shared'
import CategoryLayout from './layouts/category'
import ProductLayout from './layouts/product'
import PageLayout from './layouts/page'
import PageNotFound from './layouts/404'

function checkSiteMap(nextState, cb) {
  const {dispatch, getState} = this.store;
  const state = getState();

  api.ajax.sitemap.retrieve(nextState.location.pathname).then(sitemapResponse => {
    if (sitemapResponse.json) {
      dispatch(receiveSitemap(sitemapResponse.json))
      if (sitemapResponse.json.type === 'product-category') {
        dispatch(setCategory(sitemapResponse.json.resource))
        cb(null, props => <CategoryLayout {...props}/>);

      } else if (sitemapResponse.json.type === 'product') {
        dispatch(fetchProduct(sitemapResponse.json.resource))
        cb(null, props => <ProductLayout {...props}/>);

      } else if (sitemapResponse.json.type === 'reserved') {
        cb(null, PageLayout)
      } else {
        cb(null, PageNotFound)
      }
    } else {
      cb(null, PageNotFound)
    }
  });
}

export default(store) => (
  <Route path='/' component={SharedLayout}>
    <IndexRoute component={IndexLayout}/>
    <Route path="/:slug" getComponent={checkSiteMap} store={store}/>
    <Route path="/:categorySlug/:productSlug" getComponent={checkSiteMap} store={store}/>
    <Route path="*" component={PageNotFound} status={404}/>
  </Route>
)
