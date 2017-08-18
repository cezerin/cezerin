import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {TextField, SelectField} from 'redux-form-material-ui'

import { CustomToggle } from 'modules/shared/form'
import api from 'lib/api'
import messages from 'lib/text'
import style from './style.css'

import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';

const validate = values => {
  const errors = {}
  const requiredFields = ['email', 'full_name']

  requiredFields.map(field => {
    if (values && !values[field]) {
      errors[field] = messages.errors_required;
    }
  })

  return errors
}

class CustomerEditForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: []
    };
  }

  componentDidMount() {
    api.customerGroups.list().then(({status, json}) => {
      this.setState({groups: json});
    })
  }

  render() {
    let {handleSubmit, pristine, submitting, initialValues, onCancel} = this.props;

    let groupItems = this.state.groups.map((item, index) => <MenuItem key={index} value={item.id} primaryText={item.name}/>)
    groupItems.push(<MenuItem key="none" value={null} primaryText={messages.customers_noGroup}/>)

    return (
        <form onSubmit={handleSubmit} style={{
          display: 'initial',
          width: '100%'
        }}>
          <div>
            <div>
              <Field component={TextField} fullWidth={true} name="full_name" floatingLabelText={messages.fullName}/>
            </div>
            <Field component={SelectField} fullWidth={true} name="group_id" floatingLabelText={messages.group}>
              {groupItems}
            </Field>
            <div>
              <Field component={TextField} fullWidth={true} name="email" floatingLabelText={messages.email}/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="mobile" floatingLabelText={messages.mobile}/>
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="note" floatingLabelText={messages.note} multiLine={true}/>
            </div>
          </div>
          <div className={style.shippingButtons}>
            <FlatButton
              label={messages.cancel}
              onClick={onCancel}
            />
            <FlatButton
              label={messages.save}
              primary={true}
              type="submit"
              style={{ marginLeft: 12 }}
              disabled={pristine || submitting}
            />
          </div>
        </form>
    )
  }
}

export default reduxForm({form: 'CustomerEditForm', validate, enableReinitialize: true})(CustomerEditForm)
