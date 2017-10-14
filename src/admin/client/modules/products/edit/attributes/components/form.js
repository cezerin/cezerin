import React from 'react'
import { Link } from 'react-router-dom'
import { Field, FieldArray, reduxForm } from 'redux-form'

import messages from 'lib/text'
import style from './style.css'

import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const AttributesGrid = ({ fields, meta: { touched, error, submitFailed } }) => {
  return (
    <div>
      <div className="row row--no-gutter middle-xs">
        <div className={"col-xs-5 col--no-gutter " + style.head}>{messages.attributeName}</div>
        <div className={"col-xs-7 col--no-gutter " + style.head}>{messages.attributeValue}</div>
      </div>

      {fields.map((field, index) => {
        const fieldName = `${field}.name`;
        const fieldValue = `${field}.value`;
        return (
          <div className="row row--no-gutter middle-xs" key={index} style={{ borderBottom: '1px solid rgb(224, 224, 224)' }}>
            <div className="col-xs-5 col--no-gutter">
              <Field component="input" type="text" className={style.input} name={fieldName} placeholder={messages.attributeName}/>
            </div>
            <div className="col-xs-6 col--no-gutter">
              <Field component="input" type="text" className={style.input} name={fieldValue} placeholder={messages.attributeValue}/>
            </div>
            <div className="col-xs-1 col--no-gutter">
              <IconButton title={messages.actions_delete} onClick={() => fields.remove(index)} tabIndex={-1}>
                <FontIcon color="#a1a1a1" className="material-icons" data-index={index}>delete</FontIcon>
              </IconButton>
            </div>
          </div>
        )
      })}

      <div style={{ margin: 30 }}>
        <RaisedButton label={messages.addAttribute} onClick={() => fields.push({})} />
      </div>
    </div>
  )
}

const ProductAttributesForm = ({ handleSubmit, pristine, reset, submitting, initialValues }) => {
  return (
    <form onSubmit={handleSubmit}>
      <Paper className="paper-box" zDepth={1}>
        <FieldArray name="attributes" component={AttributesGrid}/>
        <div className={"buttons-box " + (pristine ? "buttons-box-pristine" : "buttons-box-show")}>
          <FlatButton label={messages.cancel} className={style.button} onClick={reset} disabled={pristine || submitting} />
          <RaisedButton type="submit" label={messages.save} primary={true} className={style.button} disabled={pristine || submitting}/>
        </div>
      </Paper>
    </form>
  )
}

export default reduxForm({
  form: 'ProductAttributesForm',
  enableReinitialize: true
})(ProductAttributesForm)
