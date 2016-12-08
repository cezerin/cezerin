import React from 'react'
import Helmet from 'react-helmet'
import {Button, Grid, Row, Col, Image} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import Breadcrumbs from '../components/breadcrumbs'
import ProductDetail from '../components/productDetail'

export default({
  location,
  currentPage,
  currentCategory,
  currentProduct,
  categories,
  products,
  productsFilter
}) => {
  if (currentProduct) {
    return (
      <div>
        <Helmet title={currentProduct.meta_title} meta={[
          {
            "name": "description",
            "content": currentProduct.meta_description
          }, {
            "property": "og:type",
            "content": "article"
          }
        ]} link={[{
            "rel": "canonical",
            "href": currentProduct.url
          }
        ]}/>
        <Breadcrumbs links={[
          {
            path: '/' + currentProduct.category_name,
            title: currentProduct.category_name
          }, {
            path: currentProduct.path,
            title: currentProduct.name
          }
        ]}/>
        <ProductDetail product={currentProduct}/>
      </div>
    )
  } else {
    return <p>Loading...</p>
  }
}
