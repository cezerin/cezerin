import React from 'react'
import {connect} from 'react-redux'
import {ChechoutContainer} from 'theme'
import { fetchCart, addToCart, removeFromCart } from '../actions'
import CheckoutForm from '../components/checkoutForm'

const mapStateToProps = (state, ownProps) => {
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

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addToCart: (item) => {
      dispatch(addToCart(item));
    },
    removeFromCart: (item_id) => {
      dispatch(removeFromCart(item_id));
    }
  }
}

const CheckoutPage = connect(mapStateToProps, mapDispatchToProps)(ChechoutContainer);
export default() => {
  return <CheckoutPage checkoutForm={<CheckoutForm/>} />
}
