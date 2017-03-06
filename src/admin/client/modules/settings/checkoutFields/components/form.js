import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {TextField, RadioButtonGroup} from 'redux-form-material-ui'

import messages from 'lib/text'
import style from './style.css'

import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton'
import { RadioButton } from 'material-ui/RadioButton'

const radioButtonStyle = {
  marginTop: 14,
  marginBottom: 14
}

class CheckoutFieldForm extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.onLoad(this.props.fieldName);
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
              <Field component={TextField} fullWidth={true} name="label" floatingLabelText={messages.settings_fieldLabel}/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="placeholder" floatingLabelText={messages.settings_fieldPlaceholder}/>
            </div>
            <div className="blue-title">{messages.settings_fieldStatus}</div>
            <div>
              <Field name="status" component={RadioButtonGroup}>
                <RadioButton value="required" label={messages.settings_fieldRequired} style={radioButtonStyle}/>
                <RadioButton value="optional" label={messages.settings_fieldOptional} style={radioButtonStyle}/>
                <RadioButton value="hidden" label={messages.settings_fieldHidden} style={radioButtonStyle}/>
              </Field>
            </div>
            <Divider />
          </div>
          <div style={{
            padding: 30,
            textAlign: 'right'
          }}>
            <RaisedButton type="submit" label={messages.actions_save} primary={true} className={style.button} disabled={pristine || submitting}/>
          </div>
        </form>
      </div>
    )
  }
}

export default reduxForm({form: 'CheckoutFieldForm', enableReinitialize: true})(CheckoutFieldForm)
