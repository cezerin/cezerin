import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {Link} from 'react-router-dom'
import {TextField} from 'redux-form-material-ui'

import { CustomToggle } from 'modules/shared/form'
import messages from 'lib/text'
import style from './style.css'

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';

const AccountForm = ({ handleSubmit, pristine, submitting, initialValues }) => {
  return (
    <div style={{ maxWidth: 720, width: '100%' }}>
      <div className="gray-title" style={{ margin: '15px 0 15px 20px' }}>{messages.account}</div>
      <form onSubmit={handleSubmit} style={{
        display: 'initial',
        width: '100%'
      }}>
      <Paper style={{ margin: '0px 20px' }} zDepth={1}>
        <div style={{ padding: '10px 30px 30px 30px' }} >
          <div>
            <Field component={TextField} fullWidth={true} name="email" floatingLabelText={messages.email} />
          </div>
          <div>
            <Field component={TextField} fullWidth={true} name="shop_url" floatingLabelText={messages.shopUrl} />
          </div>
          <div>
            <Field component={TextField} fullWidth={true} name="admin_url" floatingLabelText={messages.adminUrl} />
          </div>
          <Field component={CustomToggle} name="is_developer" label={messages.isDeveloper} style={{paddingTop:16, paddingBottom:16}}/>
        </div>
        <div className="buttons-box" style={{ display: pristine ? 'none' : 'block' }}>
          <RaisedButton type="submit" label={messages.save} primary={true} className={style.button} disabled={pristine || submitting}/>
        </div>
        </Paper>
      </form>
    </div>
  )
}

export default reduxForm({form: 'WebStoreAccountForm', enableReinitialize: true})(AccountForm)
