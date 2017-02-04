import { connect } from 'react-redux'
import { reset, submit } from 'redux-form';
import { fetchCart, updateCart, fetchShippingMethods, fetchPaymentMethods } from '../../actions'
import Form from './form'

const mapStateToProps = (state) => {
  return {
    initialValues: state.app.cart,
    payment_methods: state.app.payment_methods,
    shipping_methods: state.app.shipping_methods
    // isLoading
    // isSaving: state.customerGroups.isSaving
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (values) => {
      console.log('onSubmit');
      dispatch(updateCart(values));
    },
    saveForm: () => {
      dispatch(submit('FormCheckout'));
    },
    finishCheckout: (values) => {
      dispatch(updateCart(values));
    },
    onLoad: () => {
      dispatch(fetchShippingMethods());
      dispatch(fetchPaymentMethods());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
