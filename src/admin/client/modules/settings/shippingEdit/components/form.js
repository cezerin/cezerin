import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {TextField, SelectField, Toggle} from 'redux-form-material-ui'

import messages from 'src/locales'
import style from './style.css'

import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

class EditShippingMethodForm extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.onLoad(this.props.methodId);
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
              <Field component={TextField} fullWidth={true} name="name" floatingLabelText={messages.settings.shippingMethodName}/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="description" multiLine={true} floatingLabelText={messages.description}/>
            </div>
            <div>
              <Field component={TextField} name="price" type="number" floatingLabelText={messages.settings.shippingRate}/>
            </div>
            <div style={{maxWidth: 256}}>
              <Field component={Toggle} name="enabled" label={messages.enabled} style={{paddingTop:16, paddingBottom:16}}/>
              <Divider />
            </div>
            <div className="blue-title">{messages.settings.conditions}</div>
            <div>
              <Field component={TextField} fullWidth={true} name="conditions.countries" floatingLabelText={messages.settings.countries} hintText="US,UK,AU,SG"/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="conditions.states" floatingLabelText={messages.settings.states} hintText="California,Nevada,Oregon"/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="conditions.cities" floatingLabelText={messages.settings.cities} hintText="Los Angeles,San Diego,San Jose"/>
            </div>
            <div>
              <Field component={TextField} name="conditions.weight_total_min" type="number" floatingLabelText={messages.settings.minTotalWeight}/>
              <Field component={TextField} name="conditions.weight_total_max" type="number" floatingLabelText={messages.settings.maxTotalWeight}/>
            </div>
            <div>
              <Field component={TextField} name="conditions.subtotal_min" type="number" floatingLabelText={messages.settings.minSubtotal}/>
              <Field component={TextField} name="conditions.subtotal_max" type="number" floatingLabelText={messages.settings.maxSubtotal}/>
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

export default reduxForm({form: 'EditShippingMethodForm', enableReinitialize: true})(EditShippingMethodForm)
