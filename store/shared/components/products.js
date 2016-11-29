import React from 'react';
import {connect} from 'react-redux'
// import {fetchProductCategories} from './actions'
import Helmet from "react-helmet";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem, Grid, Row, Col, Thumbnail, Button} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router'

const ProductsListItem = ({ product }) => {
  const imageUrl = (product.images && product.images.length > 0) ? product.images[0].url : '/assets/images/placeholder.png';
  return (
    <Col xs={12} sm={6} md={6} lg={6}>
      <Thumbnail src={imageUrl} alt={product.name}>
        <h3>{product.name}</h3>
        <p>{product.price} {product.currency}</p>
        <p>
          <LinkContainer to={product.path}><Button bsStyle="primary">Details</Button></LinkContainer>&nbsp;
          <Button bsStyle="default">Add to cart</Button>
        </p>
      </Thumbnail>
    </Col>
  )
}

const ProductsList = ({ products, currentPage }) => {
  return (
    <div>
      <p>{JSON.stringify(currentPage)}</p>
      <Grid fluid={true}>
         <Row>
           {products.map(product => (<ProductsListItem key={product.id} product={product} />))}
         </Row>
       </Grid>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    products: state.app.products,
    currentPage: state.app.currentPage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // fetchData: () => {
    //   dispatch(fetchProductCategories());
    // }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductsList);
