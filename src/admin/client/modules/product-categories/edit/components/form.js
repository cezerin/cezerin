import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'

import { CustomToggle } from 'modules/shared/form'
import ImageUpload from 'modules/shared/image-upload'
import messages from 'lib/text'
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
      errors[ field ] = messages.errors_required;
    }
  })

  return errors
}

const asyncValidate = (values) => {
  return new Promise((resolve, reject) => {
    if(values.slug && values.slug.length > 0) {
      api.sitemap.retrieve({ path: '/' + values.slug })
        .then(({status, json}) => {
          if(status === 404) {
            resolve();
          } else {
            if(json && !Object.is(json.resource, values.id)) {
              reject({ slug: messages.errors_urlTaken });
            } else {
              resolve();
            }
          }
        });
    } else {
      resolve();
    }
  })
}

class ProductCategoryEditForm extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    const apiToken = api.token;

    let {
      handleSubmit,
      pristine,
      submitting,
      onCancel,
      onImageUpload,
      onImageDelete,
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
              <Field name="name" component={TextField} floatingLabelText={messages.productCategories_name+' *'} fullWidth={true}/>
              <Field name="description" component={TextField} floatingLabelText={messages.description} fullWidth={true} multiLine={true} rows={1}/>
              <div className={style.shortBox}>
                <Field name="enabled" component={CustomToggle} label={messages.enabled} className={style.toggle}/>
                <ImageUpload
                  imageUrl={imageUrl}
                  postUrl={`${settings.apiBaseUrl}/product_categories/${categoryId}/image`}
                  apiToken={apiToken}
                  onDelete={onImageDelete}
                  onUpload={onImageUpload}
                 />
              </div>
              <div className="blue-title">{messages.seo}</div>
              <Field name="slug" component={TextField} floatingLabelText={messages.slug} fullWidth={true}/>
              <p className="field-hint">{messages.help_slug}</p>
              <Field name="meta_title" component={TextField} floatingLabelText={messages.pageTitle} fullWidth={true}/>
              <Field name="meta_description" component={TextField} floatingLabelText={messages.metaDescription} fullWidth={true}/>
            </div>
            <div className="buttons-box">
              <FlatButton label={messages.actions_cancel} className={style.button} onClick={onCancel} />
              <RaisedButton type="submit" label={messages.actions_save} primary={true} className={style.button} disabled={pristine || submitting || isSaving}/>
            </div>
          </form>
        </Paper>
      )
    } else {
      return <div></div>
    }
  }
}

export default reduxForm({
  form: 'ProductCategoryEditForm',
  validate,
  asyncValidate,
  asyncBlurFields: [ 'slug' ],
  enableReinitialize: true
})(ProductCategoryEditForm)
