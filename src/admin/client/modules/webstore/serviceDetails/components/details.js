import React from 'react'
import ServiceDescription from './description'
import ServiceSettings from './settings'
import ServiceActions from './actions'
import ServiceLogs from './logs'
import style from './style.css'

export default class ServiceDetails extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchData();
  }

  render() {
    let { serviceId, service, serviceSettings, serviceLogs, loadingEnableDisable, enableService, disableService, updateSettings, fetchServiceLogs } = this.props;
    let actions = null;
    if(service && service.actions && Array.isArray(service.actions) && service.actions.length > 0){
      actions = service.actions;
    }

    return (
      <div className={style.detailsContainer + " scroll col-full-height"}>
        <ServiceDescription service={service} loadingEnableDisable={loadingEnableDisable} enableService={enableService} disableService={disableService} />
        {service && service.enabled && serviceSettings &&
          <ServiceSettings initialValues={serviceSettings} onSubmit={updateSettings} />
        }
        {service && service.enabled &&
          <ServiceActions actions={actions} serviceId={serviceId} fetchServiceLogs={fetchServiceLogs} />
        }
        {service && service.enabled && serviceLogs && serviceLogs.length > 0 &&
          <ServiceLogs logs={serviceLogs} />
        }
      </div>
    )
  }
}
