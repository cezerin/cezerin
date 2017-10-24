import React from 'react'
import { Field, FieldArray, reduxForm } from 'redux-form'
import { TextField, SelectField } from 'redux-form-material-ui'
import { CustomToggle } from 'modules/shared/form'
import FieldsEditor from './fieldsEditor'
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
      <form onSubmit={handleSubmit}>
        <Paper className="paper-box" zDepth={1}>
          <div className={style.innerBox}>

            <div className="row">
              <div className="col-xs-12 col-sm-4">
                <div className="blue-title">{messages.description}</div>
              </div>
              <div className="col-xs-12 col-sm-8">
                <div>
                  <Field component={TextField} fullWidth={true} name="name" floatingLabelText={messages.settings_shippingMethodName}/>
                </div>
                <div>
                  <Field component={TextField} fullWidth={true} name="description" multiLine={true} floatingLabelText={messages.description}/>
                </div>

                <div className="row">
                  <div className="col-xs-6">
                    <Field component={TextField} name="price" type="number" fullWidth={true} floatingLabelText={messages.settings_shippingRate + ` (${settings.currency_symbol})`}/>
                  </div>
                  <div className="col-xs-6">
                    <Field component={CustomToggle} name="enabled" label={messages.enabled} style={{paddingTop:16, paddingBottom:20}}/>
                    <Divider />
                  </div>
                </div>

              </div>
            </div>

            <div className="row" style={{ marginTop: '40px' }}>
              <div className="col-xs-12 col-sm-4">
                <div className="blue-title">{messages.settings_conditions}</div>
              </div>
              <div className="col-xs-12 col-sm-8">
                <div>
                  <Field component={TextField} fullWidth={true} name="conditions.countries" floatingLabelText={messages.settings_countries} hintText="US,UK,AU,SG"/>
                </div>
                <div>
                  <Field component={TextField} fullWidth={true} name="conditions.states" floatingLabelText={messages.settings_states} hintText="California,Nevada,Oregon"/>
                </div>
                <div>
                  <Field component={TextField} fullWidth={true} name="conditions.cities" floatingLabelText={messages.settings_cities} hintText="Los Angeles,San Diego,San Jose"/>
                </div>

                <div className="row">
                  <div className="col-xs-6">
                    <Field component={TextField} name="conditions.weight_total_min" type="number" fullWidth={true} floatingLabelText={messages.settings_minTotalWeight + ` (${settings.weight_unit})`}/>
                  </div>
                  <div className="col-xs-6">
                    <Field component={TextField} name="conditions.weight_total_max" type="number" fullWidth={true} floatingLabelText={messages.settings_maxTotalWeight + ` (${settings.weight_unit})`}/>
                  </div>
                </div>

                <div className="row">
                  <div className="col-xs-6">
                    <Field component={TextField} name="conditions.subtotal_min" type="number" fullWidth={true} floatingLabelText={messages.settings_minSubtotal + ` (${settings.currency_symbol})`}/>
                  </div>
                  <div className="col-xs-6">
                    <Field component={TextField} name="conditions.subtotal_max" type="number" fullWidth={true} floatingLabelText={messages.settings_maxSubtotal + ` (${settings.currency_symbol})`}/>
                  </div>
                </div>

              </div>
            </div>

            <div className="row" style={{ marginTop: '40px' }}>
              <div className="col-xs-12 col-sm-4">
                <div className="blue-title">{messages.settings_checkoutFields}</div>
                <div className="field-hint">Standard:
                  <ul>
                    <li>full_name</li>
                    <li>address1</li>
                    <li>address2</li>
                    <li>postal_code</li>
                    <li>phone</li>
                    <li>company</li>
                  </ul>
                </div>
              </div>
              <div className="col-xs-12 col-sm-8">
                <FieldArray name="fields" component={FieldsEditor}/>
              </div>
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
