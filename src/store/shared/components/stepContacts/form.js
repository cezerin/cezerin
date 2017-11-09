import React from 'react'
import {Field, reduxForm} from 'redux-form'
import text from '../../text'
import { formatCurrency } from '../../lib/helper'

const validateRequired = value => value && value.length > 0 ? undefined : text.required;

const validateEmail = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
  ? text.emailInvalid
  : undefined;

const inputField = (field) => (
  <div className={field.className}>
    <label htmlFor={field.id}>{field.label}{field.meta.touched && field.meta.error && <span className="error">{field.meta.error}</span>}</label>
    <input {...field.input} placeholder={field.placeholder} type={field.type} id={field.id} className={field.meta.touched && field.meta.error
      ? "invalid"
      : ""}/>
  </div>
)

class CheckoutStepContacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      done: false
    };
  }

  componentDidMount() {
    this.props.onLoad();
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
      initialValues,
      settings,
      saveShippingCountry,
      saveShippingState,
      saveShippingCity,
      saveShippingMethod,
      savePaymentMethod,
      paymentMethods,
      shippingMethods,
      inputClassName,
      buttonClassName,
      editButtonClassName
    } = this.props;

    if(this.state.done){
      return (
        <div className="checkout-step">
          <h1><span>1</span>{this.props.title}</h1>

          {!this.isFieldHidden('email') &&
            <div className="checkout-field-preview">
              <div className="name">{text.email}</div>
              <div className="value">{initialValues.email}</div>
            </div>
          }

          {!this.isFieldHidden('mobile') &&
            <div className="checkout-field-preview">
              <div className="name">{text.mobile}</div>
              <div className="value">{initialValues.mobile}</div>
            </div>
          }


          {!this.isFieldHidden('country') &&
            <div className="checkout-field-preview">
              <div className="name">{text.country}</div>
              <div className="value">{initialValues.shipping_address.country}</div>
            </div>
          }

          {!this.isFieldHidden('state') &&
            <div className="checkout-field-preview">
              <div className="name">{text.state}</div>
              <div className="value">{initialValues.shipping_address.state}</div>
            </div>
          }

          {!this.isFieldHidden('city') &&
            <div className="checkout-field-preview">
              <div className="name">{text.city}</div>
              <div className="value">{initialValues.shipping_address.city}</div>
            </div>
          }

          <div className="checkout-field-preview">
            <div className="name">{text.shippingMethod}</div>
            <div className="value">{initialValues.shipping_method}</div>
          </div>

          <div className="checkout-field-preview">
            <div className="name">{text.paymentMethod}</div>
            <div className="value">{initialValues.payment_method}</div>
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
          <h1><span>1</span>{this.props.title}</h1>
          <form onSubmit={handleSubmit}>

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

            <h2>{text.shippingMethods} {loadingShippingMethods && <small>{text.loading}</small>}</h2>
            <div className="shipping-methods">
              {shippingMethods.map((method, index) => <label key={index} className={'shipping-method' + (method.id === initialValues.shipping_method_id ? ' active': '')}>
                <Field
                  name="shipping_method_id"
                  component="input"
                  type="radio"
                  value={method.id}
                  onClick={() => saveShippingMethod(method.id)}
                />
                <div>
                  <div className="shipping-method-name">{method.name}</div>
                  <div className="shipping-method-description">{method.description}</div>
                </div>
                <span className="shipping-method-rate">{formatCurrency(method.price, settings)}</span>
              </label>)}
            </div>

            <h2>{text.paymentMethods} {loadingPaymentMethods && <small>{text.loading}</small>}</h2>
            <div className="payment-methods">
              {paymentMethods.map((method, index) => <label key={index} className={'payment-method' + (method.id === initialValues.payment_method_id ? ' active': '')}>
                <Field
                  name="payment_method_id"
                  validate={[validateRequired]}
                  component="input"
                  type="radio"
                  value={method.id}
                  onClick={() => savePaymentMethod(method.id)}
                />
                <div>
                  <div className="payment-method-name">{method.name}</div>
                  <div className="payment-method-description">{method.description}</div>
                </div>
                <span className="payment-method-logo"></span>
              </label>)}
            </div>

            <div className="checkout-button-wrap">
              <button
                type="button"
                onClick={handleSubmit(data => {
                  this.handleSave();
                })}
                disabled={invalid}
                className={buttonClassName}>
                {text.next}
              </button>
            </div>

          </form>
        </div>
      )
    }
  }
}

export default reduxForm({form: 'CheckoutStepContacts', enableReinitialize: true, keepDirtyOnReinitialize: true})(CheckoutStepContacts)
