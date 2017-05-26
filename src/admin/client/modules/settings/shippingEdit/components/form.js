import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {TextField, SelectField} from 'redux-form-material-ui'

import { CustomToggle } from 'modules/shared/form'
import messages from 'lib/text'
import style from './style.css'

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

const validate = values => {
  const errors = {}
  const requiredFields = ['name']

  requiredFields.map(field => {
    if (values && !values[field]) {
      errors[field] = messages.errors_required;
    }
  })

  return errors
}

class EditShippingMethodForm extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.onLoad();
  }

  render() {
    let {handleSubmit, pristine, submitting, initialValues, methodId, settings} = this.props;
    const isAdd = methodId === null || methodId === undefined;

    return (
        <form onSubmit={handleSubmit} style={{
          display: 'initial',
          width: '100%'
        }}>
        <Paper className="paper-box" zDepth={1}>
          <div className={style.innerBox}>
            <div>
              <Field component={TextField} fullWidth={true} name="name" floatingLabelText={messages.settings_shippingMethodName}/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="description" multiLine={true} floatingLabelText={messages.description}/>
            </div>
            <div>
              <Field component={TextField} name="price" type="number" floatingLabelText={messages.settings_shippingRate + ` (${settings.currency_symbol})`}/>
            </div>
            <div style={{maxWidth: 256}}>
              <Field component={CustomToggle} name="enabled" label={messages.enabled} style={{paddingTop:16, paddingBottom:16}}/>
              <Divider />
            </div>
            <div className="blue-title">{messages.settings_conditions}</div>
            <div>
              <Field component={TextField} fullWidth={true} name="conditions.countries" floatingLabelText={messages.settings_countries} hintText="US,UK,AU,SG"/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="conditions.states" floatingLabelText={messages.settings_states} hintText="California,Nevada,Oregon"/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="conditions.cities" floatingLabelText={messages.settings_cities} hintText="Los Angeles,San Diego,San Jose"/>
            </div>
            <div>
              <Field component={TextField} name="conditions.weight_total_min" type="number" floatingLabelText={messages.settings_minTotalWeight + ` (${settings.weight_unit})`}/>
              <Field component={TextField} name="conditions.weight_total_max" type="number" floatingLabelText={messages.settings_maxTotalWeight + ` (${settings.weight_unit})`}/>
            </div>
            <div>
              <Field component={TextField} name="conditions.subtotal_min" type="number" floatingLabelText={messages.settings_minSubtotal + ` (${settings.currency_symbol})`}/>
              <Field component={TextField} name="conditions.subtotal_max" type="number" floatingLabelText={messages.settings_maxSubtotal + ` (${settings.currency_symbol})`}/>
            </div>
          </div>
          <div className="buttons-box">
            <RaisedButton type="submit" label={isAdd ? messages.add : messages.save} primary={true} className={style.button} disabled={pristine || submitting}/>
          </div>
        </Paper>
        </form>
    )
  }
}

export default reduxForm({form: 'EditShippingMethodForm', validate, enableReinitialize: true})(EditShippingMethodForm)
