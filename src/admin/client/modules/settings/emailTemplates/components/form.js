import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {TextField, SelectField} from 'redux-form-material-ui'

import messages from 'lib/text'
import style from './style.css'

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

class EmailTemplate extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.onLoad();
  }

  render() {
    let {handleSubmit, pristine, submitting, initialValues} = this.props;

    return (
        <form onSubmit={handleSubmit} style={{
          display: 'initial',
          width: '100%'
        }}>
        <Paper className="paper-box" zDepth={1}>
          <div className={style.innerBox}>
            <div>
              <Field component={TextField} fullWidth={true} name="subject" floatingLabelText={messages.settings_emailSubject}/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="body" multiLine={true} floatingLabelText={messages.settings_emailBody}/>
            </div>
          </div>
          <div className="buttons-box">
            <RaisedButton type="submit" label={messages.save} primary={true} className={style.button} disabled={pristine || submitting}/>
          </div>
        </Paper>
        </form>
    )
  }
}

export default reduxForm({form: 'EmailTemplate', enableReinitialize: true})(EmailTemplate)
