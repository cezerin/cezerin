import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { deleteShippingMethod } from '../actions'
import Buttons from './components/headButtons'

const mapStateToProps = (state) => {
  return {
    shippingMethod: state.settings.shippingMethodEdit
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onDelete: (id) => {
      dispatch(deleteShippingMethod(id));
      dispatch(push('/admin/settings/shipping'));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);
