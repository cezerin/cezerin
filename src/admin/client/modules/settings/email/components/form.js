import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {TextField, Toggle, SelectField} from 'redux-form-material-ui'

import messages from 'src/locales'
import style from './style.css'

import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';

class EmailSettings extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.onLoad();
  }

  render() {
    let {handleSubmit, pristine, submitting, initialValues} = this.props;

    return (
      <div className="row row--no-gutter col-full-height col--no-gutter scroll">
        <form onSubmit={handleSubmit} style={{
          display: 'initial',
          width: '100%'
        }}>
          <div className={style.innerBox}>

            <div className="row between-xs middle-xs">
              <div className="col-xs-7">{messages.settings.smtpHost}</div>
              <div className="col-xs-5">
                <Field component={TextField} fullWidth={true} name="host" hintText="smtp.server.com"/>
              </div>
            </div>

            <Divider style={{
              marginTop: 10,
              marginBottom: 10
            }}/>

            <div className="row between-xs middle-xs">
              <div className="col-xs-7">{messages.settings.smtpPort}</div>
              <div className="col-xs-5">
                <Field component={TextField} fullWidth={true} name="port" hintText="465"/>
              </div>
            </div>

            <Divider style={{
              marginTop: 10,
              marginBottom: 10
            }}/>

            <div className="row between-xs middle-xs">
              <div className="col-xs-7">{messages.settings.smtpUser}</div>
              <div className="col-xs-5">
                <Field component={TextField} fullWidth={true} name="user"/>
              </div>
            </div>

            <Divider style={{
              marginTop: 10,
              marginBottom: 10
            }}/>

            <div className="row between-xs middle-xs">
              <div className="col-xs-7">{messages.settings.smtpPass}</div>
              <div className="col-xs-5">
                <Field component={TextField} fullWidth={true} name="pass" type="password"/>
              </div>
            </div>

            <Divider style={{
              marginTop: 10,
              marginBottom: 10
            }}/>

            <div className="row between-xs middle-xs">
              <div className="col-xs-7">{messages.settings.emailFromName}</div>
              <div className="col-xs-5">
                <Field component={TextField} fullWidth={true} name="from_name" hintText="Your Name"/>
              </div>
            </div>

            <Divider style={{
              marginTop: 10,
              marginBottom: 10
            }}/>

            <div className="row between-xs middle-xs">
              <div className="col-xs-7">{messages.settings.emailFromAddress}</div>
              <div className="col-xs-5">
                <Field component={TextField} fullWidth={true} name="from_address" hintText="your@email.com"/>
              </div>
            </div>

            <Divider style={{
              marginTop: 10,
              marginBottom: 10
            }}/>

          </div>
          <div style={{
            padding: 30,
            textAlign: 'right'
          }}>
            <RaisedButton type="submit" label={messages.actions.save} primary={true} className={style.button} disabled={pristine || submitting}/>
          </div>
        </form>
      </div>
    )
  }
}

export default reduxForm({form: 'EmailSettingsForm', enableReinitialize: false})(EmailSettings)
