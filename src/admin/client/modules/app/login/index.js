import { connect } from 'react-redux'
import { authorize } from './actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    isFetching: state.auth.isFetching,
    sentAuth: state.auth.sent,
    errorAuth: state.auth.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (values) => {
      dispatch(authorize(values.email));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
