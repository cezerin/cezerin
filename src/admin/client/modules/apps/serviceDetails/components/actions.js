import React from 'react'
import {Link} from 'react-router-dom'

import messages from 'lib/text'
import api from 'lib/api'
import style from './style.css'

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';

class ActionComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  handleActionCall = () => {
    const { action, serviceId, fetchServiceLogs } = this.props;
    this.setState({ loading: true });

    return api.webstore.services.actions.call(serviceId, action.id)
    .then(({status, json}) => {
      this.setState({ loading: false });
      fetchServiceLogs();
    })
    .catch(error => {
      alert(error);
      this.setState({ loading: false });
      fetchServiceLogs();
    });
  }

  render() {
    const { action, serviceId } = this.props;
    return (
      <div className={style.action}>
        <div className="row middle-xs">
          <div className="col-xs-7" style={{ fontSize: '14px' }}>
            {action.description}
          </div>
          <div className="col-xs-5" style={{ textAlign: 'right' }}>
            <RaisedButton label={action.name} primary={true} disabled={this.state.loading} onClick={this.handleActionCall} />
          </div>
        </div>
      </div>
    )
  }
}

const ServiceActions = ({ actions, serviceId, fetchServiceLogs }) => {
  const buttons = actions.map((action, index) => (
    <ActionComponent key={index} action={action} serviceId={serviceId} fetchServiceLogs={fetchServiceLogs} />
  ))

  return (
    <div style={{ maxWidth: 720, width: '100%' }}>
      <div className="gray-title" style={{ margin: '15px 0 15px 20px' }}>{messages.serviceActions}</div>
      <Paper className="paper-box" zDepth={1}>
        <div>
          {buttons}
        </div>
      </Paper>
    </div>
  )
}

export default ServiceActions;
