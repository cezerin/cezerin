import React from 'react'
import {connect} from 'react-redux'
import {reset, submit} from 'redux-form';
import {
  checkout,
  updateCart,
  fetchShippingMethods,
  fetchPaymentMethods,
  updateCartShippingCountry,
  updateCartShippingState,
  updateCartShippingCity,
  updateCartShippingMethod,
  updateCartPaymentMethod
} from '../../actions'
import Form from './form'

const mapStateToProps = (state, ownProps) => {
  return {
    initialValues: state.app.cart,
    paymentMethods: state.app.paymentMethods,
    shippingMethods: state.app.shippingMethods,
    loadingShippingMethods: state.app.loadingShippingMethods,
    loadingPaymentMethods: state.app.loadingPaymentMethods,
    processingCheckout: state.app.processingCheckout,
    checkoutFields: state.app.checkoutFields
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onSubmit: (values) => {
      dispatch(updateCart(values));
    },
    saveForm: (values) => {
      dispatch(submit('FormCheckout'));
    },
    finishCheckout: (values) => {
      dispatch(checkout(values));
    },
    saveShippingCountry: (value) => {
      dispatch(updateCartShippingCountry(value));
    },
    saveShippingState: (value) => {
      dispatch(updateCartShippingState(value));
    },
    saveShippingCity: (value) => {
      dispatch(updateCartShippingCity(value));
    },
    saveShippingMethod: (value) => {
      dispatch(updateCartShippingMethod(value));
    },
    savePaymentMethod: (value) => {
      dispatch(updateCartPaymentMethod(value));
    },
    onLoad: () => {
      dispatch(fetchShippingMethods());
      dispatch(fetchPaymentMethods());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
