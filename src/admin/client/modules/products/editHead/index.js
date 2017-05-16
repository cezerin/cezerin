import React from 'react'
import { connect } from 'react-redux'
import { deleteCurrentProduct } from '../actions'
import Buttons from './components/buttons'

const mapStateToProps = (state) => {
  return {
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
