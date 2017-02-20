import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {TextField, SelectField, Toggle} from 'redux-form-material-ui'

import messages from 'src/locales'
import style from './style.css'

import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';

const validate = values => {
  const errors = {}
  const requiredFields = ['name']

  requiredFields.map(field => {
    if (values && !values[field]) {
      errors[field] = messages.errors.required;
    }
  })

  return errors
}

class SelectShippingMethodsField extends React.Component {
  constructor(props) {
    super(props)
    const ids = Array.isArray(props.input.value) ? props.input.value : [];
    this.state = {
      selectedIds: ids
    };
  }

  componentWillReceiveProps(nextProps) {
    const newIds = Array.isArray(nextProps.input.value) ? nextProps.input.value : [];
    if (newIds !== this.state.selectedIds) {
      this.setState({
        selectedIds: newIds
      });
    }
  }

  onCheckboxChecked = (methodId) => {
    let ids = this.state.selectedIds;
    if(ids.includes(methodId)) {
      ids = ids.filter(id => id !== methodId);
    } else {
      ids.push(methodId);
    }
    this.setState({ selectedIds: ids});
    this.props.input.onChange(ids)
  }

  isCheckboxChecked = (methodId) => {
    return this.state.selectedIds.includes(methodId);
  }

  render() {
    const items = this.props.shippingMethods.map(method =>
      <ListItem key={method.id}
        leftCheckbox={<Checkbox checked={this.isCheckboxChecked(method.id)} onCheck={(e, isChecked) => {
          this.onCheckboxChecked(method.id)
        }} />}
        primaryText={method.name}
        secondaryText={method.description}
      />
    )

    return (
      <List>
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
    let {handleSubmit, pristine, submitting, initialValues, shippingMethods, isAdd, settings} = this.props;

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
              <Field component={TextField} name="conditions.subtotal_min" type="number" floatingLabelText={messages.settings.minSubtotal + ` (${settings.currency_symbol})`}/>
              <Field component={TextField} name="conditions.subtotal_max" type="number" floatingLabelText={messages.settings.maxSubtotal + ` (${settings.currency_symbol})`}/>
            </div>
            <div className="blue-title">{messages.settings.onlyShippingMethods}</div>
            <Field name="conditions.shipping_method_ids" component={SelectShippingMethodsField} shippingMethods={shippingMethods}/>
            <Divider />
          </div>
          <div style={{
            padding: 30,
            textAlign: 'right'
          }}>
            <RaisedButton type="submit" label={isAdd ? messages.actions.add : messages.actions.save} primary={true} className={style.button} disabled={submitting}/>
          </div>
        </form>
      </div>
    )
  }
}

export default reduxForm({form: 'EditPaymentMethodForm', validate, enableReinitialize: true})(EditPaymentMethodForm)
