import React from 'react'
import { Link } from 'react-router'
import { Field, reduxForm } from 'redux-form'
import { TextField } from 'redux-form-material-ui'

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

class ProductOptionsForm extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this.props.fetchData(this.props.productId);
  }

  componentWillUnmount() {
    // this.props.eraseData();
  }

  render() {
    let {
      handleSubmit,
      pristine,
      submitting,
      initialValues } = this.props;

      return (
        <form onSubmit={handleSubmit} style={{ display: 'initial' }}>
              <Paper className={style.form} zDepth={1}>
                <div className={style.innerBox}>
                  <div>Not implemented</div>
                </div>
                <div className="buttons-box">
                  <Link to={'/admin/products'}>
                    <FlatButton label={messages.actions_cancel} className={style.button} />
                  </Link>
                  <RaisedButton type="submit" label={messages.actions_save} primary={true} className={style.button} disabled={pristine || submitting}/>
                </div>
              </Paper>
        </form>
      )
  }
}

export default reduxForm({
  form: 'ProductOptionsForm',
  validate,
  asyncValidate,
  enableReinitialize: true
})(ProductOptionsForm)
