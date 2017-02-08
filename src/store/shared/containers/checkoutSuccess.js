import React from 'react'
import {connect} from 'react-redux'
import {ChechoutSuccessContainer} from 'theme'
import CheckoutSuccess from '../components/checkoutSuccess'

const mapStateToProps = (state, ownProps) => {
  return {
    cart: state.app.cart
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onLoad: () => {}
  }
}

const CheckoutSuccessPage = connect(mapStateToProps, mapDispatchToProps)(ChechoutSuccessContainer);
export default() => {
  return <CheckoutSuccessPage checkoutSuccess={<CheckoutSuccess/>} />
}
