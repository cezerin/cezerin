import React from 'react'
import {Field, reduxForm} from 'redux-form'
import messages from 'src/locales'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper'
import {TextField} from 'redux-form-material-ui'
import style from './style.css'

const validate = values => {
  const errors = {}
  const requiredFields = ['email']
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = messages.errors.required
    }
  })
  if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = messages.errors.email
  }
  return errors
}

const Form = (props) => {
  const {
    handleSubmit,
    pristine,
    submitting,
    isFetching,
    sentAuth,
    errorAuth
  } = props

  var response = <span className={style.noResponse}>{messages.messages.loading}</span>;
  if (sentAuth) {
    response = <span className={style.successResponse}>{messages.login.linkSent}</span>;
  } else if(sentAuth === false && errorAuth) {
    response = <span className={style.errorResponse}>{errorAuth}</span>;
  }

  return (
    <Paper className={style.login} zDepth={1}>
      <form onSubmit={handleSubmit}>
        <div className={style.title}>{messages.login.title}</div>
        <div className={style.input}>
          <Field name="email" component={TextField} label={messages.login.email} fullWidth={true} inputStyle={{textAlign:'center'}} hintStyle={{textAlign:'center', width: '100%'}} hintText={messages.login.hint}/>
        </div>
        <RaisedButton type="submit" label={messages.login.loginButton} primary={true} fullWidth={true} disabled={pristine || submitting || isFetching || sentAuth}/>
        <div className={style.response}>
          {response}
        </div>
      </form>
    </Paper>
  );
}

export default reduxForm({form: 'FormLogin', validate})(Form)
