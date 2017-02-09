import React from 'react'
import {Field, reduxForm} from 'redux-form'
import text from '../../text'

const validateRequired = value => value
  ? undefined
  : text.errors.required;

const validateEmail = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
  ? text.errors.email
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
            <Field className="checkout-field" name="email" id="customer.email" component={inputField} type="email" label={text.checkout.email} validate={[validateRequired, validateEmail]}/>
            <Field className="checkout-field" name="mobile" id="customer.mobile" component={inputField} type="tel" label={text.checkout.mobile}/>

            <h2>{text.checkout.shippingTo}</h2>
            <Field className="checkout-field" name="shipping_address.country" id="shipping_address.country" component={inputField} type="text" label={text.checkout.country} onBlur={(event, value) => setTimeout(() => saveShippingCountry(value))}/>
            <Field className="checkout-field" name="shipping_address.state" id="shipping_address.state" component={inputField} type="text" label={text.checkout.state} onBlur={(event, value) => setTimeout(() => saveShippingState(value))}/>
            <Field className="checkout-field" name="shipping_address.city" id="shipping_address.city" component={inputField} type="text" label={text.checkout.city} validate={[validateRequired]} onBlur={(event, value) => setTimeout(() => saveShippingCity(value))}/>

            <h2>{text.checkout.shippingMethod} {loadingShippingMethods && <small>{text.loading}</small>}</h2>
            <div className="shipping-methods">
              {shipping_methods.map(method => <label key={method.id} className="shipping-method">
                <Field name="shipping_method_id" component="input" type="radio" value={method.id} onClick={() => saveShippingMethod(method.id)}/>
                <div>{method.name}<br/>
                  <small>{method.id}</small>
                </div>
                <em>{method.price}</em>
              </label>)}
            </div>

            <h2>{text.checkout.paymentMethod} {loadingPaymentMethods && <small>{text.loading}</small>}</h2>
            <div className="payment-methods">
              {payment_methods.map(method => <label key={method.id} className="payment-method">
                <Field name="payment_method_id" component="input" type="radio" value={method.id} onClick={() => savePaymentMethod(method.id)}/>
                <div>{method.name}<br/>
                  <small>{method.id}</small>
                </div>
                <em>LOGO</em>
              </label>)}
            </div>

            <h2>{text.checkout.shippingAddress}</h2>

            <Field className="checkout-field" name="shipping_address.full_name" id="shipping_address.full_name" component={inputField} type="text" label={text.checkout.fullName} validate={[validateRequired]}/>
            <Field className="checkout-field" name="shipping_address.address1" id="shipping_address.address1" component={inputField} type="text" label={text.checkout.address1} validate={[validateRequired]}/>
            <Field className="checkout-field" name="shipping_address.address2" id="shipping_address.address2" component={inputField} type="text" label={text.checkout.address2}/>
            <Field className="checkout-field" name="shipping_address.zip" id="shipping_address.zip" component={inputField} type="text" label={text.checkout.zip} validate={[validateRequired]}/>
            <Field className="checkout-field" name="shipping_address.phone" id="shipping_address.phone" component={inputField} type="text" label={text.checkout.phone}/>
            <Field className="checkout-field" name="shipping_address.company" id="shipping_address.company" component={inputField} type="text" label={text.checkout.company}/>
            <Field className="checkout-field" name="comments" id="customer.comments" component={textareaField} type="text" label={text.checkout.comments} rows="3"/>

            <div className="checkout-button-wrap">
              <button type="button" onClick={handleSubmit(data => {
                finishCheckout(data)
              })} disabled={submitting || processingCheckout} className="checkout-button">{text.checkout.orderSubmit}</button>
            </div>
          </div>
        </form>
      )
    } else {
      return <p>{text.checkout.emptyCheckout}</p>
    }
  }
}

export default reduxForm({form: 'FormCheckout', enableReinitialize: true, keepDirtyOnReinitialize: true})(Form)
