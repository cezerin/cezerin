import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { fetchCheckoutField, updateCheckoutField } from '../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    initialValues: state.settings.checkoutField
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: (fieldName) => {
      dispatch(fetchCheckoutField(fieldName))
    },
    onSubmit: (values) => {
      dispatch(updateCheckoutField(values));
      dispatch(push('/admin/settings/checkout'));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
