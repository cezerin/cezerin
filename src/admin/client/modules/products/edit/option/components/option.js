import React from 'react'
import { Link } from 'react-router'
import { Field, reduxForm } from 'redux-form'
import { TextField, SelectField } from 'redux-form-material-ui'
import { CustomToggle } from 'modules/shared/form'
import OptionValues from './values'

import messages from 'lib/text'
import style from './style.css'

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';

const validate = values => {
  const errors = {}
  const requiredFields = ['name']

  requiredFields.map(field => {
    if (values && !values[field]) {
      errors[field] = messages.errors_required;
    }
  })

  return errors
}

class ProductOptionForm extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchData();
  }

  render() {
    let {
      handleSubmit,
      pristine,
      submitting,
      initialValues,
      deleteOption,
      optionValues,
      createOptionValue,
      updateOptionValue,
      deleteOptionValue } = this.props;

      return (
        <div>
          <form onSubmit={handleSubmit} style={{ display: 'initial' }}>
            <Paper className="paper-box" zDepth={1}>
              <div className={style.innerBox}>
                <Field name="name" component={TextField} floatingLabelText={messages.optionName} fullWidth={true}/>
                <Field name="position" component={TextField} type="number" floatingLabelText={messages.position} fullWidth={true}/>
                <div className={style.shortControl}>
                  <Field component={SelectField} autoWidth={true} fullWidth={true} name="control" floatingLabelText={messages.optionControl}>
                    <MenuItem value="select" primaryText={messages.optionControlSelect}/>
                  </Field>
                </div>
                <div className={style.shortControl}>
                  <Field name="required" component={CustomToggle} label={messages.settings_fieldRequired}/>
                </div>
              </div>
              <div className="buttons-box">
                <RaisedButton label={messages.actions_delete} style={{ float: 'left'}} onClick={deleteOption} />
                <RaisedButton type="submit" label={messages.save} primary={true} className={style.button} disabled={pristine || submitting}/>
              </div>
            </Paper>
          </form>
          <OptionValues optionValues={optionValues} createOptionValue={createOptionValue} updateOptionValue={updateOptionValue} deleteOptionValue={deleteOptionValue} />
        </div>
      )
  }
}

export default reduxForm({
  form: 'ProductOptionForm',
  validate,
  enableReinitialize: true
})(ProductOptionForm)
