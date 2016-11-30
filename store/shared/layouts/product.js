import React from 'react'
import Helmet from "react-helmet";
import Products from '../components/products'
import {Button, Grid, Row, Col, Image} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import Breadcrumbs from '../components/breadcrumbs'
import {connect} from 'react-redux'

const Layout = ({params, product}) => {
  if(product) {
    return (
      <div>
        <Helmet title={product.name} meta={[
          {
            "name": "description",
            "content": "Product description"
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
            path: '/' + params.categorySlug + '/' + params.productSlug,
            title: product.name
          }
        ]}/>
        <h1>{product.name}</h1>
        <Image src={(product.images && product.images.length > 0) ? product.images[0].url : '/assets/images/placeholder.png'} responsive/>
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
