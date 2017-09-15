import React from 'react'
import {Field, reduxForm} from 'redux-form'
import text from '../../text'
import { formatCurrency } from '../../lib/helper'

const validateRequired = value => value && value.length > 1 ? undefined : text.required;

const inputField = (field) => (
  <div className={field.className}>
    <label htmlFor={field.id}>{field.label}{field.meta.touched && field.meta.error && <span className="error">{field.meta.error}</span>}</label>
    <input {...field.input} placeholder={field.placeholder} type={field.type} id={field.id} className={field.meta.touched && field.meta.error
      ? "invalid"
      : ""}/>
  </div>
)

const textareaField = (field) => (
  <div className={field.className}>
    <label htmlFor={field.id}>{field.label}</label>
    <textarea {...field.input} placeholder={field.placeholder} rows={field.rows} id={field.id} className={field.meta.touched && field.meta.error
      ? "invalid"
      : ""}></textarea>
    {field.meta.touched && field.meta.error && <div className="error">{field.meta.error}</div>}
  </div>
)

class CheckoutStepShipping extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.show !== nextProps.show){
      this.setState({
        done: !nextProps.show
      });
    }
  }

  handleSave = () => {
    this.setState({
      done: true
    });
    this.props.saveForm();
    this.props.onSave();
  };

  handleEdit = () => {
    this.setState({
      done: false
    });
    this.props.onEdit();
  };

  onChangeBillingAsShipping = (event) => {
    this.setState({
      billingAsShipping: event.target.checked
    });
  };

  render() {
    const {
      handleSubmit,
      pristine,
      invalid,
      valid,
      reset,
      submitting,
      processingCheckout,
      initialValues,
      settings,
      finishCheckout,
      inputClassName,
      buttonClassName,
      editButtonClassName
    } = this.props;

    const hideBillingAddress = settings.hide_billing_address === true;
    const { payment_method_gateway, grand_total } = initialValues;
    const showPaymentForm = payment_method_gateway && payment_method_gateway !== '';

    if(!this.props.show){
      return (
        <div className="checkout-step">
          <h1><span>2</span>{this.props.title}</h1>
        </div>
      )
    } else if(this.state.done){
      return (
        <div className="checkout-step">
          <h1><span>2</span>{this.props.title}</h1>

          <div className="checkout-field-preview">
            <div className="name">{text.shippingAddress}</div>
            <div className="value">
              <div>{initialValues.shipping_address.full_name}</div>
              <div>{initialValues.shipping_address.company}</div>
              <div>{initialValues.shipping_address.address1}</div>
              <div>{initialValues.shipping_address.address2}</div>
              <div>{initialValues.shipping_address.city}, {initialValues.shipping_address.state && initialValues.shipping_address.state.length > 0 ? initialValues.shipping_address.state + ', ' : ''}{initialValues.shipping_address.postal_code}</div>
              <div>{initialValues.shipping_address.phone}</div>
            </div>
          </div>

          <div className="checkout-field-preview">
            <div className="name">{text.comments}</div>
            <div className="value">{initialValues.comments}</div>
          </div>

          <div className="checkout-button-wrap">
            <button
              type="button"
              onClick={this.handleEdit}
              className={editButtonClassName}>
              {text.edit}
            </button>
          </div>
        </div>
      )
    } else {
      return (
        <div className="checkout-step">
          <h1><span>2</span>{this.props.title}</h1>
          <form onSubmit={handleSubmit}>
            <Field className={inputClassName + ' shipping-fullname'} name="shipping_address.full_name" id="shipping_address.full_name" component={inputField} type="text" label={text.fullName} validate={[validateRequired]}/>
            <Field className={inputClassName + ' shipping-address1'} name="shipping_address.address1" id="shipping_address.address1" component={inputField} type="text" label={text.address1} validate={[validateRequired]}/>
            <Field className={inputClassName + ' shipping-address2'} name="shipping_address.address2" id="shipping_address.address2" component={inputField} type="text" label={text.address2 + ` (${text.optional})`}/>
            <Field className={inputClassName + ' shipping-postalcode'} name="shipping_address.postal_code" id="shipping_address.postal_code" component={inputField} type="text" label={text.postal_code + ` (${text.optional})`}/>
            <Field className={inputClassName + ' shipping-phone'} name="shipping_address.phone" id="shipping_address.phone" component={inputField} type="text" label={text.phone + ` (${text.optional})`}/>
            <Field className={inputClassName + ' shipping-company'} name="shipping_address.company" id="shipping_address.company" component={inputField} type="text" label={text.company + ` (${text.optional})`}/>
            <Field className={inputClassName + ' shipping-comments'} name="comments" id="customer.comments" component={textareaField} type="text" label={text.comments} rows="3"/>

            {!hideBillingAddress &&
              <div>
                <h2>{text.billingAddress}</h2>
                <div className="billing-as-shipping">
                  <input id="billingAsShipping" type="checkbox" onChange={this.onChangeBillingAsShipping} checked={this.state.billingAsShipping} />
                  <label htmlFor="billingAsShipping">{text.sameAsShipping}</label>
                </div>

                {!this.state.billingAsShipping &&
                  <div>
                    <Field className={inputClassName + ' billing-fullname'} name="billing_address.full_name" id="billing_address.full_name" component={inputField} type="text" label={text.fullName} validate={[validateRequired]}/>
                    <Field className={inputClassName + ' billing-address1'} name="billing_address.address1" id="billing_address.address1" component={inputField} type="text" label={text.address1} validate={[validateRequired]}/>
                    <Field className={inputClassName + ' billing-address2'} name="billing_address.address2" id="billing_address.address2" component={inputField} type="text" label={text.address2 + ` (${text.optional})`}/>
                    <Field className={inputClassName + ' billing-postalcode'} name="billing_address.postal_code" id="billing_address.postal_code" component={inputField} type="text" label={text.postal_code + ` (${text.optional})`}/>
                    <Field className={inputClassName + ' billing-phone'} name="billing_address.phone" id="billing_address.phone" component={inputField} type="text" label={text.phone + ` (${text.optional})`}/>
                    <Field className={inputClassName + ' billing-company'} name="billing_address.company" id="billing_address.company" component={inputField} type="text" label={text.company + ` (${text.optional})`}/>
                  </div>
                }
              </div>
            }

            <div className="checkout-button-wrap">
              {showPaymentForm &&
                <button
                  type="button"
                  onClick={handleSubmit(data => {
                    this.handleSave();
                  })}
                  disabled={invalid}
                  className={buttonClassName}>
                  {text.next}
                </button>
              }

              {!showPaymentForm &&
                <button
                  type="button"
                  onClick={handleSubmit(data => {
                    finishCheckout(data)
                  })}
                  disabled={submitting || processingCheckout || invalid}
                  className={buttonClassName}>
                  {text.orderSubmit}
                </button>
              }

            </div>
          </form>
        </div>
      )
    }
  }
}

export default reduxForm({form: 'CheckoutStepShipping', enableReinitialize: true, keepDirtyOnReinitialize: false})(CheckoutStepShipping)
