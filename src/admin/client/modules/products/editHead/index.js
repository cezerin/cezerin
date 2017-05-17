import React from 'react'
import { connect } from 'react-redux'
import { deleteCurrentProduct } from '../actions'
import Buttons from './components/buttons'

const mapStateToProps = (state) => {
  return {
    product: state.products.editProduct
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDelete: () => {
      dispatch(deleteCurrentProduct());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);
