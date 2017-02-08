import { connect } from 'react-redux'
import { reset, submit } from 'redux-form';
import { fetchCart, updateCart, fetchShippingMethods, fetchPaymentMethods, checkout,  updateCartShippingCountry,  updateCartShippingState,  updateCartShippingCity,  updateCartShippingMethod,  updateCartPaymentMethod} from '../../actions'
import Form from './form'

const mapStateToProps = (state) => {
  return {
    text: state.app.text,
    initialValues: state.app.cart,
    payment_methods: state.app.payment_methods,
    shipping_methods: state.app.shipping_methods,
    loadingShippingMethods: state.app.loadingShippingMethods,
    loadingPaymentMethods: state.app.loadingPaymentMethods,
    processingCheckout: state.app.processingCheckout
  }
}

const mapDispatchToProps = (dispatch) => {
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
