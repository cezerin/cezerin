import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { fetchServices } from '../actions'
import List from './components/list'

const mapStateToProps = (state, ownProps) => {
  return {
    services: state.webstore.services
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchData: () => {
      dispatch(fetchServices());
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(List));
