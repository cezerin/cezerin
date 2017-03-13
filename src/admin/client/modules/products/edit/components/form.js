import React from 'react'
import { Link } from 'react-router'
import { Field, reduxForm } from 'redux-form'
import { TextField, Toggle, SelectField, DatePicker } from 'redux-form-material-ui'
import Editor from 'modules/shared/editor'

import Gallery from './gallery'
import messages from 'lib/text'
import style from './style.css'
import api from 'lib/api'

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Snackbar from 'material-ui/Snackbar';
import MenuItem from 'material-ui/MenuItem';

const validate = values => {
  const errors = {}
  const requiredFields = ['name']
  const numberFields = ['regular_price', 'sale_price', 'stock_quantity', 'weight']

  requiredFields.map(field => {
    if (values && !values[field]) {
      errors[field] = messages.errors_required;
    }
  })

  numberFields.map(field => {
    if (values && values[field] && isNaN(parseFloat(values[field]))) {
      errors[field] = messages.errors_number;
    }
  })

  return errors
}

const slugExists = (values) => {
  if(values.slug && values.slug.length > 0) {
    return api.products.slugExists(values.id, values.slug).then(response => response.status === 200);
  } else {
    return Promise.resolve(false);
  }
}

const skuExists = (values) => {
  if(values.sku && values.sku.length > 0) {
    return api.products.skuExists(values.id, values.sku).then(response => response.status === 200);
  } else {
    return Promise.resolve(false);
  }
}

const asyncValidate = (values) => {
  return Promise.all([
      slugExists(values),
      skuExists(values)
    ]).then(([ isSlugExists, isSkuExists ]) => {
      let errors = {};

      if(isSlugExists) {
        errors.slug = messages.errors_urlTaken;
      }

      if(isSkuExists) {
        errors.sku = messages.skuTaken;
      }

      if (Object.keys(errors).length > 0) {
        return Promise.reject(errors)
      } else {
        return Promise.resolve();
      }
    });
}

class ProductEdit extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.fetchData(this.props.productId);
  }

  componentWillUnmount() {
    this.props.eraseData();
  }

  render() {
    let {
      handleSubmit,
      pristine,
      submitting,
      initialValues,
      isUpdating,
      settings } = this.props;

      return (
        <form onSubmit={handleSubmit} style={{ display: 'initial' }}>
          <div className="row row--no-gutter col-full-height">
            <div className="col-xs-3 col--no-gutter scroll">
              <Paper className={style.form} zDepth={1}>
                <div className={style.innerBox}>

                  <div className="blue-title">{messages.products_pricing}</div>

                  <div className="row row--no-gutter">
                    <div className="col-xs-6 col--no-gutter">
                      <Field name="regular_price" component={TextField} floatingLabelText={messages.products_regularPrice + ` (${settings.currency_symbol})`} fullWidth={true}/>
                    </div>
                    <div className="col-xs-6 col--no-gutter">
                      <Field name="sale_price" component={TextField} floatingLabelText={messages.products_salePrice + ` (${settings.currency_symbol})`} fullWidth={true}/>
                    </div>
                  </div>


                  <div className="row row--no-gutter">
                    <div className="col-xs-6 col--no-gutter">
                      <Field name="date_sale_from"
                        component={DatePicker}
                        textFieldStyle={{ width:'100%' }}
                        autoOk={true}
                        format={(value, name) => value === '' ? null : value}
                        floatingLabelText={messages.products_dateSaleFrom} />
                    </div>
                    <div className="col-xs-6 col--no-gutter">
                      <Field name="date_sale_to"
                        component={DatePicker}
                        textFieldStyle={{ width:'100%' }}
                        autoOk={true}
                        format={(value, name) => value === '' ? null : value}
                        floatingLabelText={messages.products_dateSaleTo} />
                    </div>
                  </div>

                  <div className="blue-title">{messages.products_inventory}</div>

                  <Field name="sku" component={TextField} floatingLabelText={messages.products_sku} fullWidth={true}/>

                  <div className="row row--no-gutter">
                    <div className="col-xs-6 col--no-gutter">
                      <Field name="stock_quantity" component={TextField} floatingLabelText={messages.products_stockQuantity} fullWidth={true}/>
                    </div>
                    <div className="col-xs-6 col--no-gutter">
                      <Field name="weight" component={TextField} floatingLabelText={messages.products_weight + ` (${settings.weight_unit})`} fullWidth={true}/>
                    </div>
                  </div>

                  <Field name="date_stock_expected"
                    component={DatePicker}
                    textFieldStyle={{ width:'100%' }}
                    autoOk={true}
                    format={(value, name) => value === '' ? null : value}
                    floatingLabelText={messages.products_dateStockExpected} />
                  <Field name="stock_tracking" component={Toggle} label={messages.products_stockTracking} className={style.toggle}/>
                  <Field name="stock_preorder" component={Toggle} label={messages.products_stockPreorder} className={style.toggle}/>
                  <Field name="stock_backorder" component={Toggle} label={messages.products_stockBackorder} className={style.toggle}/>


                  <div className="blue-title">{messages.products_visibility}</div>

                  <Field name="enabled" component={Toggle} label={messages.enabled} className={style.toggle}/>
                  <Field name="discontinued" component={Toggle} label={messages.products_discontinued} className={style.toggle}/>
                </div>
              </Paper>
            </div>
            <div className="col-xs-9 col--no-gutter scroll">
              <Paper className={style.form} zDepth={1}>
                  <div className={style.innerBox}>
                    <Field name="name" component={TextField} floatingLabelText={messages.products_name+' *'} fullWidth={true}/><br />

                    <div className="blue-title">{messages.description}</div>
                    <Field
                      name="description"
                      component={Editor}
                    />

                    <div className="blue-title">{messages.images}</div>
                    <Gallery />

                    <div className="blue-title">{messages.seo}</div>
                    <Field name="slug" component={TextField} floatingLabelText={messages.slug} fullWidth={true}/>
                    <p className="field-hint">{messages.help_slug}</p>
                    <Field name="meta_title" component={TextField} floatingLabelText={messages.pageTitle} fullWidth={true}/><br/>
                    <Field name="meta_description" component={TextField} floatingLabelText={messages.metaDescription} fullWidth={true}/>
                  </div>
                  <div className="buttons-box">
                    <Link to={'/admin/products'}>
                      <FlatButton label={messages.actions_cancel} className={style.button} />
                    </Link>
                    <RaisedButton type="submit" label={messages.actions_save} primary={true} className={style.button} disabled={pristine || submitting || isUpdating}/>
                  </div>
              </Paper>
            </div>
          </div>
        </form>
      )
  }
}

export default reduxForm({
  form: 'ProductEditForm',
  validate,
  asyncValidate,
  asyncBlurFields: [ 'sku', 'slug' ],
  enableReinitialize: true
})(ProductEdit)
