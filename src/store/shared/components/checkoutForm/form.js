import React from 'react'
import {Field, reduxForm} from 'redux-form'
const validateRequired = value => value ? undefined : 'Required field.';

const validateEmail = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
  'Invalid email address' : undefined;

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
  }

  componentDidMount() {
    this.props.onLoad();
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
      text,
      initialValues,
      saveShippingCountry,
      saveShippingState,
      saveShippingCity,
      saveShippingMethod,
      savePaymentMethod,
      finishCheckout,
      payment_methods,
      shipping_methods
    } = this.props;

    if (initialValues && initialValues.items.length > 0) {
      return (
        <form onSubmit={handleSubmit}>
          <div className="checkout-form">
            <Field className="checkout-field" name="email" id="customer.email" component={inputField} type="email" label="Email" validate={[validateRequired, validateEmail]}/>
            <Field className="checkout-field" name="mobile" id="customer.mobile" component={inputField} type="tel" label="Mobile (optional)"/>

            <h2>Shipping To</h2>
            <Field className="checkout-field" name="shipping_address.country" id="shipping_address.country" component={inputField} type="text" label="Country (optional)" onBlur={(event, value) => setTimeout(() => saveShippingCountry(value))}/>
            <Field className="checkout-field" name="shipping_address.state" id="shipping_address.state" component={inputField} type="text" label="State/Province (optional)" onBlur={(event, value) => setTimeout(() => saveShippingState(value))}/>
            <Field className="checkout-field" name="shipping_address.city" id="shipping_address.city" component={inputField} type="text" label="City" validate={[validateRequired]} onBlur={(event, value) => setTimeout(() => saveShippingCity(value))}/>

            <h2>{text.checkout.shippingMethod} {loadingShippingMethods && <small>Loading...</small>}</h2>
            <div className="shipping-methods">
              {shipping_methods.map(method => <label key={method.id} className="shipping-method">
                <Field name="shipping_method_id" component="input" type="radio" value={method.id} onClick={() => saveShippingMethod(method.id)}/>
                <div>{method.name}<br/>
                  <small>{method.id}</small>
                </div>
                <em>{method.price}</em>
              </label>)}
            </div>

            <h2>{text.checkout.paymentMethod} {loadingPaymentMethods && <small>Loading...</small>}</h2>
            <div className="payment-methods">
              {payment_methods.map(method => <label key={method.id} className="payment-method">
                <Field name="payment_method_id" component="input" type="radio" value={method.id} onClick={() => savePaymentMethod(method.id)}/>
                <div>{method.name}<br/>
                  <small>{method.id}</small>
                </div>
                <em>LOGO</em>
              </label>)}
            </div>

            <h2>Shipping Address</h2>

            <Field className="checkout-field" name="shipping_address.full_name" id="shipping_address.full_name" component={inputField} type="text" label="Full name" validate={[validateRequired]}/>
            <Field className="checkout-field" name="shipping_address.address1" id="shipping_address.address1" component={inputField} type="text" label="Address line 1"  validate={[validateRequired]}/>
            <Field className="checkout-field" name="shipping_address.address2" id="shipping_address.address2" component={inputField} type="text" label="Address line 2 (optional)"/>
            <Field className="checkout-field" name="shipping_address.zip" id="shipping_address.zip" component={inputField} type="text" label="Postal code" validate={[validateRequired]}/>
            <Field className="checkout-field" name="shipping_address.phone" id="shipping_address.phone" component={inputField} type="text" label="Phone (optional)"/>
            <Field className="checkout-field" name="shipping_address.company" id="shipping_address.company" component={inputField} type="text" label="Company (optional)"/>
            <Field className="checkout-field" name="comments" id="customer.comments" component={textareaField} type="text" label="Comments (optional)" rows="3"/>

            <div className="checkout-button-wrap">
              <button type="button" onClick={handleSubmit(data => {
                finishCheckout(data)
              })} disabled={submitting || processingCheckout} className="checkout-button">Place Order</button>
            </div>
          </div>
        </form>
      )
    } else {
      return <p>Cart is empty</p>
    }
  }
}

export default reduxForm({form: 'FormCheckout', enableReinitialize: true, keepDirtyOnReinitialize:true})(Form)
