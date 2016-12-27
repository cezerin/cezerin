import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { Link } from 'react-router'
import messages from 'src/locales'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper'
import { TextField } from 'redux-form-material-ui'
import style from './style.css'


const validate = values => {
  const errors = {}
  const requiredFields = [ 'email', 'pass' ]
  requiredFields.forEach(field => {
    if (!values[ field ]) {
      errors[ field ] = messages.errors.required
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
    isAuthenticated,
    isFetching,
    user,
    errorMessage } = props

    var errorMessageHtml = '';
    if(errorMessage){
      errorMessageHtml = <p className={style.error}>{errorMessage}</p>
    }
    if(isFetching) {
      errorMessageHtml += 'loading ...'
    }


  if(isAuthenticated) {
    return (
    <Paper className={style.login} zDepth={1}>
      <h2>Already logged in!</h2>
    </Paper>
  );
  } else {
    return (
      <Paper className={style.login} zDepth={1}>
        <form onSubmit={handleSubmit}>
          <h2>{messages.login.title}</h2>
          <Field name="email" component={TextField} label={messages.login.email} fullWidth={true}/>
          <Field name="pass" component={TextField} label={messages.login.password} fullWidth={true} type="password" />
          <br />
          <br />
          <RaisedButton type="submit" label={messages.login.loginButton} primary={true} fullWidth={true} disabled={pristine || submitting} />
          {errorMessageHtml}
          <p>
            <Link to="/admin-recovery">
              <FlatButton label={messages.login.recoveyButton} />
            </Link>
          </p>
        </form>
      </Paper>
    );
  }
}

export default reduxForm({
  form: 'FormLogin',
  validate
})(Form)
