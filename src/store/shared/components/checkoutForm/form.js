import React from 'react'
import { Field, reduxForm } from 'redux-form'

const validate = values => {
  const errors = {}
  // const requiredFields = ['email']
  // requiredFields.forEach(field => {
  //   if (values && !values[ field ]) {
  //     errors[ field ] = "required";
  //   }
  // })

  return errors
}

class Form extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.onLoad();
  }

  render(){
    const {handleSubmit,
    pristine,
    invalid,
    valid,
    reset,
    submitting,
    // isSaving,
    initialValues,
    saveForm,
    finishCheckout,
    payment_methods,
    shipping_methods} = this.props;

    if(initialValues && initialValues.items.length > 0){
      return (
        <form onSubmit={handleSubmit}>
          <div className="checkout-form">
            <p><Field className="checkout-text-input" name="email" component="input" type="email" placeholder="email"/></p>
            <p><Field className="checkout-text-input" name="mobile" component="input" type="tel" placeholder="mobile"/></p>

            <h2>Shipping To</h2>
            <p><Field className="checkout-text-input" name="shipping_address.country" component="input" type="text" placeholder="country" onBlur={() => setTimeout(() => saveForm())}/></p>
            <p><Field className="checkout-text-input" name="shipping_address.state" component="input" type="text" placeholder="state" onBlur={() => setTimeout(() => saveForm())}/></p>
            <p><Field className="checkout-text-input" name="shipping_address.city" component="input" type="text" placeholder="city" onBlur={() => setTimeout(() => saveForm())}/></p>

            <h2>Shipping method</h2>
            <div className="shipping-methods">
            {shipping_methods.map(method =>
              <label key={method.id} className="shipping-method">
                  <Field name="shipping_method_id" component="input" type="radio" value={method.id} onChange={() => setTimeout(() => saveForm())}/>
                  &nbsp;{method.name}, <small>{method.id}</small>, <em>-{method.price}</em>
              </label>
            )}
            </div>

            <h2>Payment method</h2>
            <div className="payment-methods">
            {payment_methods.map(method =>
              <label key={method.id} className="payment-method">
                <Field name="payment_method_id" component="input" type="radio" value={method.id}/>
                &nbsp;{method.name}, <small>{method.id}</small>
              </label>
            )}
            </div>

            <h2>Shipping Address</h2>

            <p><label htmlFor="shipping_address.full_name">Full name</label><Field className="checkout-text-input" name="shipping_address.full_name" id="shipping_address.full_name" component="input" type="text"/></p>
            <p><label htmlFor="shipping_address.address1">Address 1</label><Field className="checkout-text-input" name="shipping_address.address1" id="shipping_address.address1" component="input" type="text" placeholder="address1"/></p>
            <p><label htmlFor="shipping_address.address2">Address 2</label><Field className="checkout-text-input" name="shipping_address.address2" id="shipping_address.address2" component="input" type="text" placeholder="address2"/></p>
            <p><label htmlFor="shipping_address.zip">Zip</label><Field className="checkout-text-input" name="shipping_address.zip" id="shipping_address.zip" component="input" type="text" placeholder="zip"/></p>
            <p><label htmlFor="shipping_address.phone">Phone</label><Field className="checkout-text-input" name="shipping_address.phone" id="shipping_address.phone" component="input" type="text" placeholder="phone"/></p>
            <p><label htmlFor="shipping_address.company">Company</label><Field className="checkout-text-input" name="shipping_address.company" id="shipping_address.company" component="input" type="text" placeholder="company"/></p>

            <p><button type="button" onClick={handleSubmit(data => {finishCheckout(data)})} disabled={submitting}>Place Order</button></p>
            <p>{initialValues.id}</p>
          </div>
        </form>
      )
    } else {
      return <p>Cart is empty</p>
    }
  }
}

export default reduxForm({
  form: 'FormCheckout',
  validate,
  enableReinitialize: true
})(Form)
