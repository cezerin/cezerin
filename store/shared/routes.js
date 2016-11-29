
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Helmet from "react-helmet";
import clientSettings from '../client/settings'
import api from 'cezerin-client';
api.initAjax(clientSettings.ajaxBaseUrl);

import IndexLayout from './layouts/index'
import SharedLayout from './layouts/shared'
import CategoryLayout from './layouts/category'
import ProductLayout from './layouts/product'

const PageNotFound = () => (
  <div>
    <Helmet
        title="PageNotFound"
        meta={[
            {"name": "description", "content": "PageNotFound description"},
            {"property": "og:type", "content": "article"}
        ]}
        link={[
            {"rel": "canonical", "href": "http://mysite.com/example"}
        ]}
    />
    <h1>404: Page not found</h1>
  </div>
)

const Reserved = () => (
  <div>
    <Helmet
        title="Reserved page"
        meta={[
            {"name": "description", "content": "Reserved description"},
            {"property": "og:type", "content": "article"}
        ]}
        link={[
            {"rel": "canonical", "href": "http://mysite.com/example"}
        ]}
    />
    <h1>Reserved</h1>
  </div>
)

function checkSiteMap(nextState, cb) {
  // do asynchronous stuff to find the components
  const slug = nextState.params.slug;
  api.ajax.sitemap.retrieve(slug).then(slugData => {
    if(slugData.json) {
      //slugData.json.resource": "581f1bdb2b3dde285e44f885"
      if(slugData.json.type === 'product-category') {
        //cb(null, Category)
        cb(null, props => <CategoryLayout {...props} resource={slugData.json.resource} />);
      } else if(slugData.json.type === 'reserved') {
        cb(null, Reserved)
      } else {
        cb(null, PageNotFound)
      }
    } else {
      cb(null, PageNotFound)
    }

  });
}


export let routes = (
  <Route path='/' component={SharedLayout}>
    <IndexRoute component={IndexLayout} />
    <Route path="/:slug" getComponent={checkSiteMap} />
    <Route path="/:categorySlug/:productSlug" component={ProductLayout} />
    <Route path="*" component={PageNotFound} status={404} />
  </Route>
)
