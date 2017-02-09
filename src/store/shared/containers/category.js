import React from 'react'
import {connect} from 'react-redux'
import {CategoryContainer} from 'theme'
import { fetchCart, addCartItem, deleteCartItem } from '../actions'

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
    addCartItem: (item) => {
      dispatch(addCartItem(item));
    },
    deleteCartItem: (item_id) => {
      dispatch(deleteCartItem(item_id));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryContainer);
