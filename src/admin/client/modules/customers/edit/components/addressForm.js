import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {TextField, SelectField} from 'redux-form-material-ui'

import { CustomToggle } from 'modules/shared/form'
import messages from 'lib/text'
import style from './style.css'

import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

const validate = values => {
  const errors = {}
  const requiredFields = ['city']

  requiredFields.map(field => {
    if (values && !values[field]) {
      errors[field] = messages.errors_required;
    }
  })

  return errors
}

class CustomerAddressForm extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let {handleSubmit, pristine, submitting, initialValues, onCancel} = this.props;

    return (
        <form onSubmit={handleSubmit} style={{
          display: 'initial',
          width: '100%'
        }}>
          <div>
            <div>
              <Field component={TextField} fullWidth={true} name="full_name" floatingLabelText={messages.fullName}/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="company" floatingLabelText={messages.company}/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="address1" floatingLabelText={messages.address1}/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="address2" floatingLabelText={messages.address2}/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="city" floatingLabelText={messages.city}/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="state" floatingLabelText={messages.state}/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="postal_code" floatingLabelText={messages.postal_code}/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="country" floatingLabelText={messages.country}/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="phone" floatingLabelText={messages.phone}/>
            </div>
          </div>
          <div className={style.shippingButtons}>
            <FlatButton
              label={messages.cancel}
              onClick={onCancel}
            />
            <FlatButton
              label={messages.save}
              primary={true}
              type="submit"
              style={{ marginLeft: 12 }}
              disabled={pristine || submitting}
            />
          </div>
        </form>
    )
  }
}

export default reduxForm({form: 'CustomerAddressForm', validate, enableReinitialize: true})(CustomerAddressForm)
