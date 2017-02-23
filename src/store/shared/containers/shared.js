import React from 'react'
import {connect} from 'react-redux'
import {SharedContainer} from 'theme'
import { fetchCart, addCartItem, deleteCartItem, updateCartItemQuantiry } from '../actions'

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    location: state.app.location,
    currentPage: state.app.currentPage,
    currentCategory: state.app.currentCategory,
    currentProduct: state.app.currentProduct,
    categories: state.app.categories,
    products: state.app.products,
    productsFilter: state.app.productsFilter,
    cart: state.app.cart,
    page: state.app.page
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addCartItem: (item) => {
      dispatch(addCartItem(item));
    },
    deleteCartItem: (item_id) => {
      dispatch(deleteCartItem(item_id));
    },
    updateCartItemQuantiry: (item_id, quantity) => {
      dispatch(updateCartItemQuantiry(item_id, quantity));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SharedContainer);
