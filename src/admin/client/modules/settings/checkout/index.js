import { connect } from 'react-redux'
import { push } from 'react-router-redux';
import { fetchCheckoutFields } from '../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    checkoutFields: state.settings.checkoutFields
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad: () => {
      dispatch(fetchCheckoutFields())
    },
    pushUrl: (path) => {
      dispatch(push(path));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
