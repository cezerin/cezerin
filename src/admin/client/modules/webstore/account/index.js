import { connect } from 'react-redux'
import { fetchAccount, updateAccount } from '../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    initialValues: state.webstore.account
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: () => {
      dispatch(fetchAccount())
    },
    onSubmit: (values) => {
      dispatch(updateAccount(values));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
