import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {reset, submit} from 'redux-form';
import {checkout, updateShipping} from '../../actions'
import Form from './form'

const mapStateToProps = (state, ownProps) => {
  return {
    initialValues: state.app.cart,
    settings: state.app.settings,
    processingCheckout: state.app.processingCheckout
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (values) => {
      dispatch(updateShipping(values));
    },
    saveForm: (values) => {
      dispatch(submit('CheckoutStepShipping'));
    },
    finishCheckout: (values) => {
      dispatch(checkout(values, ownProps.history));
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form));
