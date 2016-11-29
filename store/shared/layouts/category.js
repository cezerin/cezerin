import React from 'react'
import Helmet from "react-helmet";
import Products from '../components/products'
import { Button, Grid, Row, Col } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Breadcrumbs from '../components/breadcrumbs'

const Layout = ({ params, resource }) => (
  <div>
    <Helmet
        title="Category"
        meta={[
            {"name": "description", "content": "Category description"},
            {"property": "og:type", "content": "article"}
        ]}
        link={[
            {"rel": "canonical", "href": "http://mysite.com/example"}
        ]}
    />
    <Breadcrumbs links={[ { path: '/' + params.slug, title: params.slug} ]} />
    <h1>Category: {params.slug}, resource: {resource}</h1>
    <Products />
  </div>
)

export default Layout
