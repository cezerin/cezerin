import React from 'react'
import { Field, reduxForm } from 'redux-form'

// const validate = values => {
//   const errors = {}
//   const requiredFields = ['name']
//
//   requiredFields.forEach(field => {
//     if (values && !values[ field ]) {
//       errors[ field ] = "required";
//     }
//   })
//
//   return errors
// }

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
    reset,
    submitting,
    // isSaving,
    initialValues} = this.props;

    console.log(initialValues);

    if(initialValues && initialValues.items.length > 0){
      return (
        <form onSubmit={handleSubmit}>
          <div>
            <p>{initialValues.id}</p>
            <br/><Field name="email" component="input" type="text" placeholder="email"/>
            <br/><Field name="mobile" component="input" type="text" placeholder="mobile"/>
            <br/>
            <br/>
            <br/><Field name="shipping_address.address1" component="input" type="text" placeholder="address1"/>
            <br/><Field name="shipping_address.address2" component="input" type="text" placeholder="address2"/>
            <br/><Field name="shipping_address.city" component="input" type="text" placeholder="city"/>
            <br/><Field name="shipping_address.country" component="input" type="text" placeholder="country"/>
            <br/><Field name="shipping_address.state" component="input" type="text" placeholder="state"/>
            <br/><Field name="shipping_address.phone" component="input" type="text" placeholder="phone"/>
            <br/><Field name="shipping_address.zip" component="input" type="text" placeholder="zip"/>
            <br/><Field name="shipping_address.full_name" component="input" type="text" placeholder="full_name"/>
            <br/><Field name="shipping_address.company" component="input" type="text" placeholder="company"/>


            <br/><button type="submit" disabled={pristine || submitting}>Submit</button>
          </div>
        </form>
      )
    } else {
      return <p>Cart is empty</p>
    }
  }
}


export default reduxForm({
  form: 'FormCheckout'
  // validate
  //enableReinitialize: true
})(Form)




// "billing_address":
// "shipping_address":
// "email": "",
// "mobile": "",
// "coupon": "",
// "payment_method_id": null,
// "shipping_method_id": null,
//
//
//
//
// "referrer_url": "",
// "landing_url": "",
// "browser": {
//   "ip": "",
//   "user_agent": ""


// <FlatButton label={messages.actions.cancel} className={style.button} onClick={() => { this.props.onCancel(); }} />
// <RaisedButton type="submit" label={groupId ? messages.actions.save : messages.actions.add} primary={true} className={style.button} disabled={pristine || submitting || isSaving}/>
// htmlFor
// window.navigator.userAgent
// var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
// req.get('user-agent')
// req.get('Referer'
