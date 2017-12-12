import { connect } from 'react-redux'
import { fetchService, enableService, disableService, updateServiceSettings, fetchServiceLogs } from '../actions'
import Details from './components/details'

const mapStateToProps = (state, ownProps) => {
  const { serviceId } = ownProps.match.params;

  return {
    serviceId: serviceId,
    service: state.apps.service,
    serviceSettings: state.apps.serviceSettings,
    serviceLogs: state.apps.serviceLogs,
    loadingEnableDisable: state.apps.loadingEnableDisableService
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
    },
    updateSettings: (values) => {
      const { serviceId } = ownProps.match.params;
      dispatch(updateServiceSettings(serviceId, values))
    },
    fetchServiceLogs: () => {
      const { serviceId } = ownProps.match.params;
      dispatch(fetchServiceLogs(serviceId))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Details);
