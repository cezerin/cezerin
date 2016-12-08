import React from 'react'
import {Route, IndexRoute} from 'react-router'
import clientSettings from '../client/settings'
import {fetchProduct, setCategory, receiveSitemap} from './actions'

import api from 'cezerin-client';
api.initAjax(clientSettings.ajaxBaseUrl);

import IndexContainer from './containers/index'
import SharedContainer from './containers/shared'
import CategoryContainer from './containers/category'
import ProductContainer from './containers/product'
import CustomPageContainer from './containers/customPage'
import NotFoundContainer from './containers/notfound'

function checkSitemap(nextState, cb) {
  const {dispatch, getState} = this.store;
  const state = getState();

  api.ajax.sitemap.retrieve(nextState.location.pathname).then(sitemapResponse => {
    if (sitemapResponse.json) {
      dispatch(receiveSitemap(sitemapResponse.json))
      if (sitemapResponse.json.type === 'product-category') {
        dispatch(setCategory(sitemapResponse.json.resource))
        cb(null, props => <CategoryContainer {...props}/>);

      } else if (sitemapResponse.json.type === 'product') {
        dispatch(fetchProduct(sitemapResponse.json.resource))
        cb(null, props => <ProductContainer {...props}/>);

      } else if (sitemapResponse.json.type === 'reserved') {
        cb(null, CustomPageContainer)
      } else {
        cb(null, NotFoundContainer)
      }
    } else {
      cb(null, NotFoundContainer)
    }
  });
}

export default(store) => (
  <Route path='/' component={SharedContainer}>
    <IndexRoute component={IndexContainer}/>
    <Route path="/:slug" getComponent={checkSitemap} store={store}/>
    <Route path="/:categorySlug/:productSlug" getComponent={checkSitemap} store={store}/>
    <Route path="*" component={NotFoundContainer} status={404}/>
  </Route>
)
