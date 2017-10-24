import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {TextField, SelectField} from 'redux-form-material-ui'

import { CustomToggle } from 'modules/shared/form'
import api from 'lib/api'
import messages from 'lib/text'
import style from './style.css'

import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';

const validate = values => {
  const errors = {}
  const requiredFields = []

  requiredFields.map(field => {
    if (values && !values[field]) {
      errors[field] = messages.errors_required;
    }
  })

  return errors
}

class SummaryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shippingMethods: [],
      paymentMethods: [],
      orderStatuses: []
    };
  }

  componentDidMount() {
    this.fetchData(this.props.initialValues.id);
  }

  fetchData = (orderId) => {
    const filter = {
      order_id: orderId
    };

    api.orderStatuses.list().then(({status, json}) => {
      this.setState({orderStatuses: json});
    })

    api.shippingMethods.list(filter).then(({status, json}) => {
      this.setState({shippingMethods: json});
    })

    api.paymentMethods.list(filter).then(({status, json}) => {
      this.setState({paymentMethods: json});
    })
  }

  render() {
    let {handleSubmit, pristine, submitting, initialValues, onCancel} = this.props;

    const statusItems = this.state.orderStatuses.map((item, index) => <MenuItem key={index} value={item.id} primaryText={item.name}/>)
    const shippingItems = this.state.shippingMethods.map((item, index) => <MenuItem key={index} value={item.id} primaryText={item.name}/>)
    const paymentItems = this.state.paymentMethods.map((item, index) => <MenuItem key={index} value={item.id} primaryText={item.name}/>)

    statusItems.push(<MenuItem key="none" value={null} primaryText={messages.noOrderStatus}/>)

    return (
        <form onSubmit={handleSubmit} style={{
          display: 'initial',
          width: '100%'
        }}>
          <div>
            <Field component={SelectField} fullWidth={true} name="status_id" floatingLabelText={messages.orderStatus}>
              {statusItems}
            </Field>

            <div>
              <Field component={TextField} fullWidth={true} name="tracking_number" floatingLabelText={messages.trackingNumber}/>
            </div>

            <Field component={SelectField} fullWidth={true} name="shipping_method_id" floatingLabelText={messages.shippingMethod}>
              {shippingItems}
            </Field>

            <Field component={SelectField} fullWidth={true} name="payment_method_id" floatingLabelText={messages.paymentsMethod}>
              {paymentItems}
            </Field>

            <div>
              <Field component={TextField} fullWidth={true} name="comments" floatingLabelText={messages.customerComment}/>
            </div>

            <div>
              <Field component={TextField} fullWidth={true} name="note" floatingLabelText={messages.note}/>
            </div>

            <div>
              <Field component={TextField} fullWidth={true} name="email" floatingLabelText={messages.email}/>
            </div>

            <div>
              <Field component={TextField} fullWidth={true} name="mobile" floatingLabelText={messages.mobile}/>
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

export default reduxForm({form: 'SummaryForm', validate, enableReinitialize: true})(SummaryForm)
