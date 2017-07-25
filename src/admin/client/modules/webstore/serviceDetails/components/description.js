import React from 'react'
import {Link} from 'react-router-dom'

import messages from 'lib/text'
import style from './style.css'

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';

const ServiceDescription = ({ service }) => {
  if(service){
    return (
      <Paper className="paper-box" zDepth={1} style={{ maxWidth: 720 }}>
        <div className={style.innerBox}>
          <div className="row">
            <div className="col-xs-4">
              <img src={service.cover_url} alt={service.name} className={style.cover} />
            </div>
            <div className="col-xs-8">
              <h1 className={style.title}>{service.name}</h1>
              <div className={style.developer}>{service.developer.name}</div>
              {!service.installed &&
                <RaisedButton label={messages.enable} primary={true}/>
              }
              {service.installed &&
                <RaisedButton label={messages.disable} secondary={true}/>
              }
            </div>
          </div>

          <div className={style.description}>{service.description}</div>
        </div>
      </Paper>
    )
  } else {
    return null;
  }
}

export default ServiceDescription;
