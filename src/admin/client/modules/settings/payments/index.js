import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { fetchPaymentMethods } from '../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    paymentMethods: state.settings.paymentMethods
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => {
      dispatch(fetchPaymentMethods())
    },
    pushUrl: (path) => {
      dispatch(push(path));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
