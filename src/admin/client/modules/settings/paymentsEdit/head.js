import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { deletePaymentMethod } from '../actions'
import Buttons from './components/headButtons'

const mapStateToProps = (state, ownProps) => {
  return {
    paymentMethod: state.settings.paymentMethodEdit
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onDelete: (id) => {
      dispatch(deletePaymentMethod(id));
      ownProps.history.push('/admin/settings/payments');
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Buttons));
