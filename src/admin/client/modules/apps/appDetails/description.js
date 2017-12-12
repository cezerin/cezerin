import React from 'react'

import messages from 'lib/text'
import style from './style.css'

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';

const AppDescription = ({ name, description, coverUrl, developer, enabled }) => (
  <div style={{ maxWidth: 720, width: '100%' }}>
    <Paper className="paper-box" zDepth={1}>
      <div className={style.innerBox}>
        <div className="row">
          <div className="col-xs-4">
            <img src={coverUrl} alt={name} className={style.cover} />
          </div>
          <div className="col-xs-8">
            <h1 className={style.title}>{name}</h1>
            <div className={style.developer}>{developer}</div>
            {/* {!enabled &&
              <RaisedButton label={messages.enable} primary={true} disabled={loadingEnableDisable} onClick={enableService} />
            }
            {enabled &&
              <RaisedButton label={messages.disable} disabled={loadingEnableDisable} onClick={disableService} />
            } */}
          </div>
        </div>
        <div
          className={style.description}
          dangerouslySetInnerHTML={{ __html: description }}>
        </div>
      </div>
    </Paper>
  </div>
)

export default AppDescription;
