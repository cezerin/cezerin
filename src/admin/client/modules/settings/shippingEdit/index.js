import { connect } from 'react-redux'
import { fetchShippingMethod, updateShippingMethod } from '../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    initialValues: state.settings.shippingMethodEdit
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: (methodId) => {
      dispatch(fetchShippingMethod(methodId))
    },
    onSubmit: (method) => {
      if(!Array.isArray(method.conditions.countries)) {
        const countriesStr = method.conditions.countries;
        method.conditions.countries = countriesStr.split(',').map(item => item.trim().toUpperCase()).filter(item => item.length === 2);
      }

      if(!Array.isArray(method.conditions.states)) {
        const statesStr = method.conditions.states;
        method.conditions.states = statesStr.split(',').map(item => item.trim());
      }

      if(!Array.isArray(method.conditions.cities)) {
        const citiesStr = method.conditions.cities;
        method.conditions.cities = citiesStr.split(',').map(item => item.trim());
      }

      dispatch(updateShippingMethod(method));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
