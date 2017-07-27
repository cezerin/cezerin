import React from 'react'
import ServiceDescription from './description'
import style from './style.css'

export default class ServiceDetails extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchData();
  }

  render() {
    let { service, loadingEnableDisable, enableService, disableService } = this.props;
    return (
      <div className={style.detailsContainer + " scroll col-full-height"}>
        <ServiceDescription service={service} loadingEnableDisable={loadingEnableDisable} enableService={enableService} disableService={disableService} />
      </div>
    )
  }
}
