import React from 'react'
import {connect} from 'react-redux'
import {NotFoundContainer} from 'theme'
import { fetchCart, addToCart, removeFromCart } from '../actions'

const mapStateToProps = (state) => {
  return {
    location: state.app.location,
    currentPage: state.app.currentPage,
    currentCategory: state.app.currentCategory,
    currentProduct: state.app.currentProduct,
    categories: state.app.categories,
    products: state.app.products,
    productsFilter: state.app.productsFilter,
    cart: state.app.cart
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item) => {
      dispatch(addToCart(item));
    },
    removeFromCart: (item_id) => {
      dispatch(removeFromCart(item_id));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotFoundContainer);
