import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {TextField, SelectField} from 'redux-form-material-ui'

import messages from 'src/locales'
import style from './style.css'

import RaisedButton from 'material-ui/RaisedButton';

class EmailTemplate extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.onLoad(this.props.templateName);
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
            <div>
              <Field component={TextField} fullWidth={true} name="subject" floatingLabelText={messages.settings.emailSubject}/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="body" multiLine={true} floatingLabelText={messages.settings.emailBody}/>
            </div>
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

export default reduxForm({form: 'EmailTemplate', enableReinitialize: true})(EmailTemplate)
