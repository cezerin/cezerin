import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {TextField, SelectField, Toggle} from 'redux-form-material-ui'

import messages from 'src/locales'
import style from './style.css'

import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';

class SelectShippingMethodsField extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      shipping_method_ids: []
    };
  }

  render() {
    const field = this.props;
    //console.log(field.input.value);
    let selectedIds = field.input.value || [];

    const items = field.shippingMethods.map(method =>
      <ListItem key={method.id}
        leftCheckbox={<Checkbox checked={selectedIds.includes(method.id)} onCheck={(e, isChecked) => {

          if(selectedIds.includes(method.id)) {
            selectedIds = [];//selectedIds.filter(item => item != method.id);
          } else {
            selectedIds.push(method.id);
          }

          console.log(selectedIds);
          field.input.onChange(selectedIds);
          //field.input.onChange(["5891b9394e05b32a570c1346", "5891d11ed869d239a6929e5b"]);

          if(isChecked) {
            //selectedIds.push(method.id);
            //console.log(selectedIds);
            //field.input.onChange(selectedIds)
          } else {
            //selectedIds = selectedIds.filter(item => item != method.id);
            //console.log(selectedIds);
            //field.input.onChange(selectedIds)
          }
        }} />}
        primaryText={method.name+',' + selectedIds.includes(method.id)}
        secondaryText={method.id}
      />
    )

    return (
      <List>
        {selectedIds.toString()}
        {items}
      </List>
    )
  }
}

class EditPaymentMethodForm extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.onLoad(this.props.methodId);
  }

  render() {
    let {handleSubmit, pristine, submitting, initialValues, shippingMethods} = this.props;

    return (
      <div className="row row--no-gutter col-full-height col--no-gutter scroll">
        <form onSubmit={handleSubmit} style={{
          display: 'initial',
          width: '100%'
        }}>
          <div className={style.innerBox}>
            <div>
              <Field component={TextField} fullWidth={true} name="name" floatingLabelText={messages.settings.paymentMethodName}/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="description" multiLine={true} floatingLabelText={messages.description}/>
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
              <Field component={TextField} name="conditions.subtotal_min" type="number" floatingLabelText={messages.settings.minSubtotal}/>
              <Field component={TextField} name="conditions.subtotal_max" type="number" floatingLabelText={messages.settings.maxSubtotal}/>
            </div>
            <div className="blue-title">{messages.settings.onlyShippingMethods}</div>
            <Field name="conditions.shipping_method_ids" component={SelectShippingMethodsField} shippingMethods={shippingMethods}/>
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

export default reduxForm({form: 'EditPaymentMethodForm', enableReinitialize: true})(EditPaymentMethodForm)
