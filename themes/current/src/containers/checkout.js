import React from 'react'
import Helmet from 'react-helmet'
import {PageHeader, Button, Grid, Row, Col} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'

export default({
  location,
  currentPage,
  currentCategory,
  currentProduct,
  categories,
  products,
  productsFilter,
  cart,
  addCartItem,
  deleteCartItem,
  checkoutForm
}) => (
  <div>
    <Helmet title="Checkout" meta={[
      {
        "name": "description",
        "content": "Checkout"
      }, {
        "property": "og:type",
        "content": "article"
      }
    ]}/>
    <PageHeader>Checkout</PageHeader>
    {checkoutForm}
  </div>
)
