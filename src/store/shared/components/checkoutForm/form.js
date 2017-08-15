import React from 'react'
import {Field, reduxForm} from 'redux-form'
import text from '../../text'
import { formatCurrency } from '../../lib/helper'

const validateRequired = value => value
  ? undefined
  : text.required;

const validateEmail = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
  ? text.emailInvalid
  : undefined;

const inputField = (field) => (
  <div className={field.className}>
    <label htmlFor={field.id}>{field.label}</label>
    <input {...field.input} placeholder={field.placeholder} type={field.type} id={field.id} className={field.meta.touched && field.meta.error
      ? "invalid"
      : ""}/> {field.meta.touched && field.meta.error && <div className="error">{field.meta.error}</div>}
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

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      billingAsShipping: true
    };
  }

  componentDidMount() {
    this.props.onLoad();
  }

  onChangeBillingAsShipping = (event) => {
    this.setState({billingAsShipping: event.target.checked});
  };

  getField = (fieldName) => {
    const fields = this.props.checkoutFields || [];
    const field = fields.find(item => item.name === fieldName);
    return field;
  }

  getFieldStatus = (fieldName) => {
    const field = this.getField(fieldName);
    return field && field.status ? field.status : 'required';
  }

  isFieldOptional = (fieldName) => {
    return this.getFieldStatus(fieldName) === 'optional';
  }

  isFieldHidden = (fieldName) => {
    return this.getFieldStatus(fieldName) === 'hidden';
  }

  getFieldValidators = (fieldName) => {
    const isOptional = this.isFieldOptional(fieldName);
    let validatorsArray = [];
    if(!isOptional) {
      validatorsArray.push(validateRequired);
    }
    if(fieldName === 'email') {
      validatorsArray.push(validateEmail);
    }

    return validatorsArray;
  }

  getFieldPlaceholder = (fieldName) => {
    const field = this.getField(fieldName);
    return field && field.placeholder && field.placeholder.length > 0 ? field.placeholder : '';
  }

  getFieldLabelText = (fieldName) => {
    const field = this.getField(fieldName);
    if(field && field.label && field.label.length > 0) {
      return field.label;
    } else {
      switch (fieldName) {
        case 'email':
          return text.email;
          break;
        case 'mobile':
          return text.mobile;
          break;
        case 'country':
          return text.country;
          break;
        case 'state':
          return text.state;
          break;
        case 'city':
          return text.city;
          break;
        default:
          return 'Unnamed field';
      }
    }
  }

  getFieldLabel = (fieldName) => {
    const labelText = this.getFieldLabelText(fieldName);
    return this.isFieldOptional(fieldName) ? `${labelText} (${text.optional})` : labelText;
  }

  render() {
    const {
      handleSubmit,
      pristine,
      invalid,
      valid,
      reset,
      submitting,
      loadingShippingMethods,
      loadingPaymentMethods,
      processingCheckout,
      initialValues,
      settings,
      saveShippingCountry,
      saveShippingState,
      saveShippingCity,
      saveShippingMethod,
      savePaymentMethod,
      finishCheckout,
      paymentMethods,
      shippingMethods,
      inputClassName = 'checkout-field',
      buttonClassName = 'checkout-button'
    } = this.props;

    const hideBillingAddress = settings.hide_billing_address === true;

    if (initialValues && initialValues.items.length > 0) {
      return (
        <form onSubmit={handleSubmit}>
          <div className="checkout-form">

            {!this.isFieldHidden('email') &&
              <Field className={inputClassName} name="email" id="customer.email" component={inputField} type="email"
                label={this.getFieldLabel('email')}
                validate={this.getFieldValidators('email')}
                placeholder={this.getFieldPlaceholder('email')}/>
            }

            {!this.isFieldHidden('mobile') &&
              <Field className={inputClassName} name="mobile" id="customer.mobile" component={inputField} type="tel"
                label={this.getFieldLabel('mobile')}
                validate={this.getFieldValidators('mobile')}
                placeholder={this.getFieldPlaceholder('mobile')}/>
            }

            <h2>{text.shippingTo}</h2>

            {!this.isFieldHidden('country') &&
              <Field className={inputClassName} name="shipping_address.country" id="shipping_address.country" component={inputField} type="text"
                label={this.getFieldLabel('country')}
                validate={this.getFieldValidators('country')}
                placeholder={this.getFieldPlaceholder('country')}
                onBlur={(event, value) => setTimeout(() => saveShippingCountry(value))}/>
            }

            {!this.isFieldHidden('state') &&
              <Field className={inputClassName} name="shipping_address.state" id="shipping_address.state" component={inputField} type="text"
                label={this.getFieldLabel('state')}
                validate={this.getFieldValidators('state')}
                placeholder={this.getFieldPlaceholder('state')}
                onBlur={(event, value) => setTimeout(() => saveShippingState(value))}/>
            }

            {!this.isFieldHidden('city') &&
              <Field className={inputClassName} name="shipping_address.city" id="shipping_address.city" component={inputField} type="text"
                label={this.getFieldLabel('city')}
                validate={this.getFieldValidators('city')}
                placeholder={this.getFieldPlaceholder('city')}
                onBlur={(event, value) => setTimeout(() => saveShippingCity(value))}/>
            }

            <h2>{text.shippingMethod} {loadingShippingMethods && <small>{text.loading}</small>}</h2>
            <div className="shipping-methods">
              {shippingMethods.map(method => <label key={method.id} className="shipping-method">
                <Field name="shipping_method_id" component="input" type="radio" value={method.id} onClick={() => saveShippingMethod(method.id)}/>
                <div>
                  <div className="shipping-method-name">{method.name}</div>
                  <div className="shipping-method-description">{method.description}</div>
                </div>
                <span className="shipping-method-rate">{formatCurrency(method.price, settings)}</span>
              </label>)}
            </div>

            <h2>{text.paymentMethod} {loadingPaymentMethods && <small>{text.loading}</small>}</h2>
            <div className="payment-methods">
              {paymentMethods.map(method => <label key={method.id} className="payment-method">
                <Field name="payment_method_id" component="input" type="radio" value={method.id} onClick={() => savePaymentMethod(method.id)}/>
                <div>
                  <div className="payment-method-name">{method.name}</div>
                  <div className="payment-method-description">{method.description}</div>
                </div>
                <span className="payment-method-logo"></span>
              </label>)}
            </div>

            <h2>{text.shippingAddress}</h2>

            <Field className={inputClassName + ' shipping-fullname'} name="shipping_address.full_name" id="shipping_address.full_name" component={inputField} type="text" label={text.fullName} validate={[validateRequired]}/>
            <Field className={inputClassName + ' shipping-address1'} name="shipping_address.address1" id="shipping_address.address1" component={inputField} type="text" label={text.address1} validate={[validateRequired]}/>
            <Field className={inputClassName + ' shipping-address2'} name="shipping_address.address2" id="shipping_address.address2" component={inputField} type="text" label={text.address2}/>
            <Field className={inputClassName + ' shipping-postalcode'} name="shipping_address.postal_code" id="shipping_address.postal_code" component={inputField} type="text" label={text.postal_code}/>
            <Field className={inputClassName + ' shipping-phone'} name="shipping_address.phone" id="shipping_address.phone" component={inputField} type="text" label={text.phone}/>
            <Field className={inputClassName + ' shipping-company'} name="shipping_address.company" id="shipping_address.company" component={inputField} type="text" label={text.company}/>
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
                    <Field className={inputClassName + ' billing-address2'} name="billing_address.address2" id="billing_address.address2" component={inputField} type="text" label={text.address2}/>
                    <Field className={inputClassName + ' billing-postalcode'} name="billing_address.postal_code" id="billing_address.postal_code" component={inputField} type="text" label={text.postal_code} validate={[validateRequired]}/>
                    <Field className={inputClassName + ' billing-phone'} name="billing_address.phone" id="billing_address.phone" component={inputField} type="text" label={text.phone}/>
                    <Field className={inputClassName + ' billing-company'} name="billing_address.company" id="billing_address.company" component={inputField} type="text" label={text.company}/>
                  </div>
                }
              </div>
            }

            <div className="checkout-button-wrap">
              <button type="button" onClick={handleSubmit(data => {
                finishCheckout(data)
              })} disabled={submitting || processingCheckout} className={buttonClassName}>{text.orderSubmit}</button>
            </div>
          </div>
        </form>
      )
    } else {
      return <p>{text.emptyCheckout}</p>
    }
  }
}

export default reduxForm({form: 'FormCheckout', enableReinitialize: true, keepDirtyOnReinitialize: true})(Form)
