import { connect } from 'react-redux'
import { fetchAccount, updateDeveloperAccount } from '../actions'
import Form from './components/form'

const mapStateToProps = (state) => {
  return {
    initialValues: state.webstore.account ? state.webstore.account.developer : null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: () => {
      dispatch(fetchAccount())
    },
    onSubmit: (values) => {
      dispatch(updateDeveloperAccount(values));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Form);
