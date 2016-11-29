import React from 'react'
import Helmet from "react-helmet";
import Products from '../components/products'
import { Button, Grid, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Breadcrumbs from '../components/breadcrumbs'

const Layout = ({ params, resource }) => (
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
    <Breadcrumbs links={[ { path: '/' + params.categorySlug, title: params.categorySlug}, , { path: '/' + params.categorySlug + '/' + params.productSlug, title: params.productSlug} ]} />
    <h1>Product: {params.productSlug} in {params.categorySlug}, resource: {resource}</h1>
  </div>
)

export default Layout
