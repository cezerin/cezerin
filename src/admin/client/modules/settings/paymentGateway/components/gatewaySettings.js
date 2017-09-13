import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {TextField, SelectField} from 'redux-form-material-ui'

import { CustomToggle } from 'modules/shared/form'
import messages from 'lib/text'
import style from './style.css'
import Checkbox from 'material-ui/Checkbox';
import MenuItem from 'material-ui/MenuItem';

const GatewaySettings = ({ gateway }) => {
  switch(gateway){
    case 'paypal-checkout':
      return <PayPalButton />;
    default:
      return null;
  }
}

export default GatewaySettings;

const PayPalButton = props => {
  return (
    <div>
      <Field component={SelectField} name="env" floatingLabelText="Environment" fullWidth={true} autoWidth={true}>
        <MenuItem value="production" primaryText="production" />
        <MenuItem value="sandbox" primaryText="sandbox" />
      </Field>

      <Field component={TextField} name="client" floatingLabelText="Client ID" fullWidth={true} />

      <Field component={SelectField} name="size" floatingLabelText="Button size" fullWidth={true} autoWidth={true}>
        <MenuItem value="small" primaryText="small" />
        <MenuItem value="medium" primaryText="medium" />
        <MenuItem value="large" primaryText="large" />
        <MenuItem value="responsive" primaryText="responsive" />
      </Field>

      <Field component={SelectField} name="shape" floatingLabelText="Button shape" fullWidth={true} autoWidth={true}>
        <MenuItem value="pill" primaryText="pill" />
        <MenuItem value="rect" primaryText="rect" />
      </Field>

      <Field component={SelectField} name="color" floatingLabelText="Button color" fullWidth={true} autoWidth={true}>
        <MenuItem value="gold" primaryText="gold" />
        <MenuItem value="blue" primaryText="blue" />
        <MenuItem value="silver" primaryText="silver" />
        <MenuItem value="black" primaryText="black" />
      </Field>

      <Field component={TextField} name="notify_url" floatingLabelText="Notify URL" hintText="https://<domain>/api/v1/notifications/paypal" fullWidth={true} />
    </div>
  )
}
