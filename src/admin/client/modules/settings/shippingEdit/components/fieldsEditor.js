import React from 'react'
import { Link } from 'react-router-dom'
import { Field, FieldArray, reduxForm } from 'redux-form'
import {TextField, SelectField} from 'redux-form-material-ui'

import { CustomToggle } from 'modules/shared/form'
import messages from 'lib/text'
import style from './style.css'

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';

const FieldsEditor = ({ fields, meta: { touched, error, submitFailed } }) => {
  return (
    <div>
      {fields.map((field, index) => {
        const fieldKey = `${field}.key`;
        const fieldLabel = `${field}.label`;
        const fieldRequired = `${field}.required`;

        return (
          <Paper className="paper-box" zDepth={1} rounded={false} key={index} style={{ padding: '0px 20px', margin: '10px 0px', backgroundColor: '#f7f7f7' }}>
            <div className="row middle-xs center-xs">
              <div className="col-xs-4">
                <Field component={TextField} name={fieldKey} floatingLabelText={messages.fieldKey} fullWidth={true} required pattern="^[A-Za-z0-9_]{2,32}$"/>
              </div>
              <div className="col-xs-4">
                <Field component={TextField} name={fieldLabel} floatingLabelText={messages.settings_fieldLabel} fullWidth={true}/>
              </div>
              <div className="col-xs-3">
                <Field component={CustomToggle} name={fieldRequired} label={messages.settings_fieldRequired} style={{paddingTop:16, paddingBottom:16}}/>
              </div>
              <div className="col-xs-1">
                <IconMenu
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                  iconButtonElement={
                    <IconButton touch={true}>
                      <FontIcon color="#777" className="material-icons">more_vert</FontIcon>
                    </IconButton>
                  }
                >
                <MenuItem primaryText={messages.actions_delete} onClick={() => fields.remove(index)} />
                {index > 0 &&
                  <MenuItem primaryText={messages.actions_moveUp} onClick={() => fields.move(index, index-1)} />
                }
                {(index+1) < fields.length &&
                  <MenuItem primaryText={messages.actions_moveDown} onClick={() => fields.move(index, index+1)} />
                }
                </IconMenu>
              </div>
            </div>
          </Paper>
        )
      })}

      <div style={{ margin: '20px 0px' }}>
        <RaisedButton label={messages.add} onClick={() => fields.push({})} />
      </div>
    </div>
  )
}

export default FieldsEditor;
