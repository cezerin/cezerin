import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {TextField, Toggle} from 'redux-form-material-ui'

import messages from 'src/locales'
import style from './style.css'
import api from 'lib/api'
import Editor from 'modules/shared/editor'

import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

const validate = values => {
  const errors = {}
  const requiredFields = ['slug', 'meta_title']

  requiredFields.map(field => {
    if (!values.is_system && values && !values[field]) {
      errors[field] = messages.errors.required;
    }
  })

  return errors
}

const asyncValidate = (values/*, dispatch */) => {
  return new Promise((resolve, reject) => {
    if(!values.slug && values.is_system) {
      resolve();
    } else {
      api.sitemap.retrieve(`/${values.slug}`)
        .then(({status, json}) => {
          if(status === 404) {
            resolve();
          } else {
            if(json && !Object.is(json.resource, values.id)) {
              reject({ slug: messages.errors.urlTaken });
            } else {
              resolve();
            }
          }
        });
    }
  })
}

class EditPageForm extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.onLoad(this.props.pageId);
  }

  render() {
    let {handleSubmit, pristine, submitting, initialValues, isAdd} = this.props;

    return (
      <div className="row row--no-gutter col-full-height col--no-gutter scroll">
        <form onSubmit={handleSubmit} style={{
          display: 'initial',
          width: '100%'
        }}>
          <div className={style.innerBox}>
            <div className="blue-title">{messages.content}</div>
            <div style={{marginBottom:50}}>
              <Field name="content" component={Editor}/>
            </div>
            <div className="blue-title">{messages.seo}</div>
            <Field name="slug" component={TextField} floatingLabelText={messages.slug} fullWidth={true} disabled={initialValues.is_system}/>
            <p className="field-hint">{messages.help.slug}</p>
            <Field name="meta_title" component={TextField} floatingLabelText={messages.pageTitle} fullWidth={true}/><br/>
            <Field name="meta_description" component={TextField} floatingLabelText={messages.metaDescription} fullWidth={true}/>
            <div style={{maxWidth: 256}}>
              <Field component={Toggle} name="enabled" label={messages.enabled} style={{paddingTop:16, paddingBottom:16}} disabled={initialValues.is_system}/>
            </div>
          </div>
          <div style={{
            padding: 30,
            textAlign: 'right'
          }}>
            <RaisedButton type="submit" label={isAdd ? messages.actions.add : messages.actions.save} primary={true} className={style.button} disabled={pristine || submitting}/>
          </div>
        </form>
      </div>
    )
  }
}

export default reduxForm({form: 'EditPageForm', validate, asyncValidate, enableReinitialize: true})(EditPageForm)
