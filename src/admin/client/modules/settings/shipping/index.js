import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { fetchShippingMethods } from '../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    shippingMethods: state.settings.shippingMethods
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => {
      dispatch(fetchShippingMethods())
    },
    pushUrl: (path) => {
      dispatch(push(path));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
