var api = require('cezerin-client');
api.init("http://localhost/api/", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNDc0OTgxNTE1fQ.dEyqeTPqFErKqoFKXTi6joNMn8UHgTvGWsjNMHJ7owY");

import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Helmet from "react-helmet";

//import Home from './home'
import IndexLayout from './layouts/index'
import SharedLayout from './layouts/shared'
import CategoryLayout from './layouts/category'

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

const Product = ({ params, resource }) => (
  <div>
    <Helmet
        title="Product page"
        meta={[
            {"name": "description", "content": "Product description"},
            {"property": "og:type", "content": "article"}
        ]}
        link={[
            {"rel": "canonical", "href": "http://mysite.com/example"}
        ]}
    />
    <h1>Product: {params.productSlug} in {params.categorySlug}, resource: {resource}</h1>
    <img src="https://nodejs.org/static/images/interactive/background.jpg" />
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
  api.sitemap.retrieve(slug).then(slugData => {
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
    <Route path="/:categorySlug/:productSlug" component={Product} />
    <Route path="*" component={PageNotFound} status={404} />
  </Route>
)
