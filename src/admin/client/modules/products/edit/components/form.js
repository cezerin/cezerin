import React from 'react'
import { Link } from 'react-router'
import { Field, reduxForm } from 'redux-form'
import { TextField, Toggle, SelectField, DatePicker } from 'redux-form-material-ui'
import Editor from 'modules/shared/editor'

import Gallery from './gallery'
import messages from 'src/locales'
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
      errors[field] = messages.errors.required;
    }
  })

  numberFields.map(field => {
    if (values && values[field] && isNaN(parseFloat(values[field]))) {
      errors[field] = messages.errors.number;
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
      isSaving,
      initialValues,
      settings } = this.props;

    if(!initialValues) {
      return <div></div>
    }

    let images = initialValues.images;

    return (
      <form onSubmit={handleSubmit} style={{ display: 'initial' }}>
        <div className="row row--no-gutter col-full-height">
          <div className="col-xs-3 col--no-gutter scroll">
            <Paper className={style.form} zDepth={1}>
              <div className={style.innerBox}>

                <div className="blue-title">{messages.products.pricing}</div>

                <div className="row row--no-gutter">
                  <div className="col-xs-6 col--no-gutter">
                    <Field name="regular_price" component={TextField} floatingLabelText={messages.products.regularPrice + ` (${settings.currency_symbol})`} fullWidth={true}/>
                  </div>
                  <div className="col-xs-6 col--no-gutter">
                    <Field name="sale_price" component={TextField} floatingLabelText={messages.products.salePrice + ` (${settings.currency_symbol})`} fullWidth={true}/>
                  </div>
                </div>


                <div className="row row--no-gutter">
                  <div className="col-xs-6 col--no-gutter">
                    <Field name="date_sale_from"
                      component={DatePicker}
                      textFieldStyle={{ width:'100%' }}
                      autoOk={true}
                      format={(value, name) => value === '' ? null : value}
                      floatingLabelText={messages.products.dateSaleFrom} />
                  </div>
                  <div className="col-xs-6 col--no-gutter">
                    <Field name="date_sale_to"
                      component={DatePicker}
                      textFieldStyle={{ width:'100%' }}
                      autoOk={true}
                      format={(value, name) => value === '' ? null : value}
                      floatingLabelText={messages.products.dateSaleTo} />
                  </div>
                </div>

                <div className="blue-title">{messages.products.inventory}</div>

                <Field name="sku" component={TextField} floatingLabelText={messages.products.sku} fullWidth={true}/>

                <div className="row row--no-gutter">
                  <div className="col-xs-6 col--no-gutter">
                    <Field name="stock_quantity" component={TextField} floatingLabelText={messages.products.stockQuantity} fullWidth={true}/>
                  </div>
                  <div className="col-xs-6 col--no-gutter">
                    <Field name="weight" component={TextField} floatingLabelText={messages.products.weight + ` (${settings.weight_unit})`} fullWidth={true}/>
                  </div>
                </div>

                <Field name="date_stock_expected"
                  component={DatePicker}
                  textFieldStyle={{ width:'100%' }}
                  autoOk={true}
                  format={(value, name) => value === '' ? null : value}
                  floatingLabelText={messages.products.dateStockExpected} />
                <Field name="stock_tracking" component={Toggle} label={messages.products.stockTracking} className={style.toggle}/>
                <Field name="stock_preorder" component={Toggle} label={messages.products.stockPreorder} className={style.toggle}/>
                <Field name="stock_backorder" component={Toggle} label={messages.products.stockBackorder} className={style.toggle}/>


                <div className="blue-title">{messages.products.visibility}</div>

                <Field name="active" component={Toggle} label={messages.products.active} className={style.toggle}/>
                <Field name="discontinued" component={Toggle} label={messages.products.discontinued} className={style.toggle}/>
              </div>
            </Paper>
          </div>
          <div className="col-xs-9 col--no-gutter scroll">
            <Paper className={style.form} zDepth={1}>
                <div className={style.innerBox}>
                  <Field name="name" component={TextField} floatingLabelText={messages.products.name+' *'} fullWidth={true}/><br />

                  <div className="blue-title">{messages.description}</div>
                  <Field
                    name="description"
                    component={Editor}
                  />

                  <div className="blue-title">{messages.images}</div>
                  <Gallery />

                  <div className="blue-title">{messages.seo}</div>
                  <Field name="slug" component={TextField} floatingLabelText={messages.slug} fullWidth={true}/>
                  <p className="field-hint">{messages.help.slug}</p>
                  <Field name="meta_title" component={TextField} floatingLabelText={messages.pageTitle} fullWidth={true}/><br/>
                  <Field name="meta_description" component={TextField} floatingLabelText={messages.metaDescription} fullWidth={true}/>
                </div>
                <div className="buttons-box">
                  <Link to={'/admin/products'}>
                    <FlatButton label={messages.actions.cancel} className={style.button} />
                  </Link>
                  <RaisedButton type="submit" label={messages.actions.save} primary={true} className={style.button} disabled={pristine || submitting || isSaving}/>
                </div>
            </Paper>
          </div>
        </div>
      </form>
    )
  }
}

export default reduxForm({
  form: 'FormProduct',
  validate,
  asyncValidate,
  enableReinitialize: false
})(ProductEdit)
