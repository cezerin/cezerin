import { connect } from 'react-redux'
import { reset } from 'redux-form';
import { fetchCart, updateCart } from '../../actions'
import Form from './form'

const mapStateToProps = (state) => {
  return {
    initialValues: state.app.cart    
    // isLoading
    // isSaving: state.customerGroups.isSaving
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (values) => {
      dispatch(updateCart(values));
    },
    onLoad: () => {

    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
