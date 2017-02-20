import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { deletePaymentMethod } from '../actions'
import Buttons from './components/headButtons'

const mapStateToProps = (state) => {
  return {
    paymentMethod: state.settings.paymentMethodEdit
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDelete: (id) => {
      dispatch(deletePaymentMethod(id));
      dispatch(push('/admin/settings/payments'));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);
