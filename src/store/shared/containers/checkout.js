import React from 'react'
import {connect} from 'react-redux'
import {addCartItem, deleteCartItem, updateCartItemQuantiry, fetchMoreProducts} from '../actions'
import {CheckoutContainer, config} from 'theme'
import CheckoutForm from '../components/checkoutForm'

const mapStateToProps = (state, ownProps) => {
  return {
    state: state.app
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    addCartItem: (item) => {
      dispatch(addCartItem(item));
    },
    deleteCartItem: (item_id) => {
      dispatch(deleteCartItem(item_id));
    },
    updateCartItemQuantiry: (item_id, quantity) => {
      dispatch(updateCartItemQuantiry(item_id, quantity));
    },
    loadMoreProducts: () => {
      dispatch(fetchMoreProducts());
    }
  }
}

const ConnectedCheckoutContainer = connect(mapStateToProps, mapDispatchToProps)(CheckoutContainer);
export default() => {
  return <ConnectedCheckoutContainer checkoutForm={<CheckoutForm
    inputClassName={config.checkout_input_class}
    buttonClassName={config.checkout_button_class}
  />} />
}
