import { connect } from 'react-redux'
import { fetchService, enableService, disableService } from '../actions'
import Details from './components/details'

const mapStateToProps = (state, ownProps) => {
  return {
    service: state.webstore.service,
    loadingEnableDisable: state.webstore.loadingEnableDisableService
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    fetchData: () => {
      const { serviceId } = ownProps.match.params;
      dispatch(fetchService(serviceId))
    },
    enableService: () => {
      const { serviceId } = ownProps.match.params;
      dispatch(enableService(serviceId))
    },
    disableService: () => {
      const { serviceId } = ownProps.match.params;
      dispatch(disableService(serviceId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Details);
