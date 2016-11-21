import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { TextField, Toggle } from 'redux-form-material-ui'

import ImageUpload from 'modules/shared/image-upload'
import messages from 'src/locale'
import style from './style.css'
import settings from 'lib/settings'
import api from 'lib/api'

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

const validate = values => {
  const errors = {}
  const requiredFields = ['name']

  requiredFields.forEach(field => {
    if (values && !values[ field ]) {
      errors[ field ] = messages.errors.required;
    }
  })

  return errors
}

const asyncValidate = (values/*, dispatch */) => {
  return new Promise((resolve, reject) => {
    if(!values.slug) {
      resolve();
    } else {
      api.sitemap.retrieve(values.slug)
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

class Form extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    const apiToken = api.token;

    let {
      handleSubmit,
      pristine,
      submitting,
      isSaving,
      initialValues } = this.props;

    let imageUrl = null;
    let categoryId = null;

    if(initialValues){
      categoryId = initialValues.id
      imageUrl = initialValues.image;
    }

    if(categoryId) {
      return (
        <Paper className={style.form} zDepth={1}>
          <form onSubmit={handleSubmit}>
            <div className={style.innerBox}>
              <Field name="name" component={TextField} floatingLabelText={messages.productCategories.name+' *'} fullWidth={true}/><br />
              <Field name="description" component={TextField} floatingLabelText={messages.description} fullWidth={true} multiLine={true} rows={2}/>
              <div className={style.shortBox}>
                <Field name="active" component={Toggle} label={messages.productCategories.active} className={style.toggle}/><br />
                <ImageUpload
                  imageUrl={imageUrl}
                  postUrl={`${settings.api.url.base}/products/categories/${categoryId}/image`}
                  apiToken={`Bearer ${apiToken}`}
                  onDelete={() => { api.products.categories.deleteImage(categoryId); }}
                  onUpload={() => {}}
                 />
              </div>
              <div className="blue-title">{messages.seo}</div>
              <Field name="slug" component={TextField} floatingLabelText={messages.slug} fullWidth={true}/>
              <p className="field-hint">{messages.help.slug}</p>
              <Field name="meta_title" component={TextField} floatingLabelText={messages.pageTitle} fullWidth={true}/><br/>
              <Field name="meta_description" component={TextField} floatingLabelText={messages.metaDescription} fullWidth={true}/>
            </div>
            <div className="buttons-box">
              <FlatButton label={messages.actions.cancel} className={style.button} onClick={() => { this.props.onCancel(); }} />
              <RaisedButton type="submit" label={messages.actions.save} primary={true} className={style.button} disabled={pristine || submitting || isSaving}/>
            </div>
          </form>
        </Paper>
      )
    } else {
      return <br />
    }
  }
}

export default reduxForm({
  form: 'FormProductCategory',
  validate,
  asyncValidate,
  enableReinitialize: true
})(Form)
