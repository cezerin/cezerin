import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { fetchPaymentMethod, updatePaymentMethod, fetchShippingMethods, createPaymentMethod, receivePaymentMethod } from '../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    settings: state.settings.settings,
    initialValues: state.settings.paymentMethodEdit,
    shippingMethods: state.settings.shippingMethods
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: (methodId) => {
      if(methodId) {
        dispatch(fetchPaymentMethod(methodId));
      } else {
        dispatch(receivePaymentMethod({ enabled: false }));
      }
      dispatch(fetchShippingMethods());
    },
    onSubmit: (method) => {
      if(method.conditions && method.conditions.countries && !Array.isArray(method.conditions.countries)) {
        const countriesStr = method.conditions.countries;
        method.conditions.countries = countriesStr.split(',').map(item => item.trim().toUpperCase()).filter(item => item.length === 2);
      }

      if(method.id) {
        dispatch(updatePaymentMethod(method));
      } else {
        dispatch(createPaymentMethod(method));
        dispatch(push('/admin/settings/payments'));
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
