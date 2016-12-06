import React from 'react'
import Helmet from "react-helmet";
import ProductDetail from '../components/productDetail'
import {Button, Grid, Row, Col, Image} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import Breadcrumbs from '../components/breadcrumbs'
import {connect} from 'react-redux'

const Layout = ({params, product}) => {
  if(product) {
    return (
      <div>
        <Helmet title={product.meta_title} meta={[
          {
            "name": "description",
            "content": product.meta_description
          }, {
            "property": "og:type",
            "content": "article"
          }
        ]} link={[{
            "rel": "canonical",
            "href": product.url
          }
        ]}/>
        <Breadcrumbs links={[
          {
            path: '/' + params.categorySlug,
            title: product.category_name
          }, {
            path: product.path,
            title: product.name
          }
        ]}/>
        <ProductDetail product={product} />
      </div>
    )
  } else {
    return <p>Loading...</p>
  }
}

const mapStateToProps = (state) => {
  return {product: state.app.currentProduct}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
