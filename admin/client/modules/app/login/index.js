import { connect } from 'react-redux'
import { loginUser, logoutUser } from './actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isFetching: state.auth.isFetching,
    user: state.auth.user,
    errorMessage: state.auth.errorMessage
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmit: (values) => {
      dispatch(loginUser(values.email, values.pass));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
