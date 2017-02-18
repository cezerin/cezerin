import { connect } from 'react-redux'
import { fetchPaymentMethod, updatePaymentMethod, fetchShippingMethods } from '../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    initialValues: state.settings.paymentMethodEdit,
    shippingMethods: state.settings.shippingMethods
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: (methodId) => {
      dispatch(fetchPaymentMethod(methodId));
      dispatch(fetchShippingMethods());
    },
    onSubmit: (method) => {
      if(!Array.isArray(method.conditions.countries)) {
        const countriesStr = method.conditions.countries;
        method.conditions.countries = countriesStr.split(',').map(item => item.trim().toUpperCase()).filter(item => item.length === 2);
      }

      console.log(method);
      //dispatch(updatePaymentMethod(method));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
