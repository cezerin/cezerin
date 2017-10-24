import React from 'react'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import {reset, submit} from 'redux-form';
import {checkout, updateShipping} from '../../actions'
import Form from './form'

const mapStateToProps = (state, ownProps) => {
  let shippingMethod = null;
  const { shipping_method_id } = state.app.cart;
  if(shipping_method_id && state.app.shippingMethods && state.app.shippingMethods.length > 0){
    shippingMethod = state.app.shippingMethods.find(method => method.id === shipping_method_id);
  }

  return {
    shippingMethod: shippingMethod,
    initialValues: state.app.cart,
    settings: state.app.settings,
    checkoutFields: state.app.checkoutFields,
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
