import React from 'react'
import ServiceDescription from './description'
import ServiceSettings from './settings'
import ServiceActions from './actions'
import ServiceLogs from './logs'
import style from './style.css'

export default class ServiceDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timer: null
    };
  }

  componentDidMount() {
    this.props.fetchData();

    // refresh logs every 5 sec
    const timer = setInterval(() => {
      const { service, fetchServiceLogs } = this.props;
      if(service && service.enabled){
        fetchServiceLogs();
      }
    }, 5000)

    this.setState({ timer: timer });
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  render() {
    let { serviceId, service, serviceSettings, serviceLogs, loadingEnableDisable, enableService, disableService, updateSettings, fetchServiceLogs } = this.props;
    let actions = null;
    const serviceError = serviceSettings && serviceSettings.error === true;
    if(service && service.actions && Array.isArray(service.actions) && service.actions.length > 0){
      actions = service.actions;
    }

    return (
      <div className={style.detailsContainer + " scroll col-full-height"}>
        <ServiceDescription service={service} loadingEnableDisable={loadingEnableDisable} enableService={enableService} disableService={disableService} />
        {serviceError &&
          <div style={{ color: '#FC3246', fontSize: '24px', margin: '30px' }}>
            Service error
          </div>
        }
        {service && service.enabled && serviceSettings && !serviceError &&
          <ServiceSettings initialValues={serviceSettings} onSubmit={updateSettings} />
        }
        {service && service.enabled && !serviceError &&
          <ServiceActions actions={actions} serviceId={serviceId} fetchServiceLogs={fetchServiceLogs} />
        }
        {service && service.enabled && serviceLogs && serviceLogs.length > 0 &&
          <ServiceLogs logs={serviceLogs} />
        }
      </div>
    )
  }
}
