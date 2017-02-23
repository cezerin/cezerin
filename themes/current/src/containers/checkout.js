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
  checkoutForm,
  page
}) => (
  <div>
    <Helmet title={page.meta_title} meta={[
      {
        "name": "description",
        "content": page.meta_description
      }, {
        "property": "og:type",
        "content": "article"
      }
    ]} link={[{
        "rel": "canonical",
        "href": page.url
      }
    ]}/>
    <PageHeader>Checkout</PageHeader>
    {checkoutForm}
  </div>
)
