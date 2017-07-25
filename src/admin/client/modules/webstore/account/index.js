import { connect } from 'react-redux'
import { fetchAccount, updateAccount, updateDeveloperAccount } from '../actions'
import Details from './components/details'

const mapStateToProps = (state) => {
  return {
    account: state.webstore.account
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: () => {
      dispatch(fetchAccount())
    },
    onAccountSubmit: (values) => {
      dispatch(updateAccount(values));
    },
    onDeveloperSubmit: (values) => {
      dispatch(updateDeveloperAccount(values));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Details);
