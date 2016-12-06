import React from 'react'
import Helmet from "react-helmet";
import Products from '../components/products'
import {PageHeader, Button, Grid, Row, Col} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import Breadcrumbs from '../components/breadcrumbs'
import {connect} from 'react-redux'

const Layout = ({params, category}) => (
  <div>
    <Helmet title={category.name} meta={[
      {
        "name": "description",
        "content": "Category description"
      }, {
        "property": "og:type",
        "content": "article"
      }
    ]} link={[{
        "rel": "canonical",
        "href": category.url
      }
    ]}/>
    <Breadcrumbs links={[{
        path: '/' + category.slug,
        title: category.name
      }
    ]}/>
    <PageHeader>{category.name}</PageHeader>
    <Products/>
  </div>
)

const mapStateToProps = (state) => {
  return {category: state.app.currentCategory}
}

export default connect(mapStateToProps)(Layout);
