import React from 'react';
import {connect} from 'react-redux'
// import {fetchProductCategories} from './actions'
import Helmet from "react-helmet";
import { Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';

const ProductsListItem = ({ product }) => {
  return (
    <p>
      {product.name} - {product.price}
    </p>
  )
}

const ProductsList = ({ products, currentPage }) => {
  return (
    <div>
      <p>{JSON.stringify(currentPage)}</p>
      {products.map(product => (<ProductsListItem key={product.id} product={product} />))}
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
