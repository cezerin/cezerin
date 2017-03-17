import React from 'react'
import {connect} from 'react-redux'
import {addCartItem, deleteCartItem, updateCartItemQuantiry, fetchMoreProducts} from '../actions'
import {NotFoundContainer} from 'theme'

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

export default connect(mapStateToProps, mapDispatchToProps)(NotFoundContainer);
