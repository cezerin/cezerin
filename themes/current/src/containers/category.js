import React from 'react'
import Helmet from 'react-helmet'
import {PageHeader, Button, Grid, Row, Col} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import Breadcrumbs from '../components/breadcrumbs'
import Products from '../components/products'

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
  deleteCartItem
}) => (
  <div>
    <Helmet title={currentCategory.meta_title !== '' ? currentCategory.meta_title : currentCategory.name} meta={[
      {
        "name": "description",
        "content": currentCategory.meta_description
      }, {
        "property": "og:type",
        "content": "article"
      }
    ]} link={[{
        "rel": "canonical",
        "href": currentCategory.url
      }
    ]}/>
    <Breadcrumbs links={[{
        path: '/' + currentCategory.slug,
        title: currentCategory.name
      }
    ]}/>
    <PageHeader>{currentCategory.name}</PageHeader>
    <Products products={products} addCartItem={addCartItem}/>
  </div>
)
