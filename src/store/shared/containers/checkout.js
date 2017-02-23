import React from 'react'
import {connect} from 'react-redux'
import {ChechoutContainer} from 'theme'
import { fetchCart, addCartItem, deleteCartItem } from '../actions'
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
    cart: state.app.cart,
    page: state.app.page
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addCartItem: (item) => {
      dispatch(addCartItem(item));
    },
    deleteCartItem: (item_id) => {
      dispatch(deleteCartItem(item_id));
    }
  }
}

const CheckoutPage = connect(mapStateToProps, mapDispatchToProps)(ChechoutContainer);
export default() => {
  return <CheckoutPage checkoutForm={<CheckoutForm/>} />
}
