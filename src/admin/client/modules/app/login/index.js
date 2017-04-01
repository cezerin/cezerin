import { connect } from 'react-redux'
import { authorize } from './actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    isFetching: state.auth.isFetching,
    emailIsSent: state.auth.emailIsSent,
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
