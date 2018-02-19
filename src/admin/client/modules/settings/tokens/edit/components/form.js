import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {TextField} from 'redux-form-material-ui'

import messages from 'lib/text'
import style from './style.css'
import ConfirmationDialog from 'modules/shared/confirmation'
import { MultiSelect } from 'modules/shared/form'

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

const Scopes = [
  'admin',
  'dashboard',
  'read:products',
  'write:products',
  'read:product_categories',
  'write:product_categories',
  'read:orders',
  'write:orders',
  'read:customers',
  'write:customers',
  'read:customer_groups',
  'write:customer_groups',
  'read:pages',
  'write:pages',
  'read:order_statuses',
  'write:order_statuses',
  'read:theme',
  'write:theme',
  'read:sitemap',
  '',
  'read:shipping_methods',
  'write:shipping_methods',
  'read:payment_methods',
  'write:payment_methods',
  'read:settings',
  'write:settings',
  'read:files',
  'write:files'];

const validate = values => {
  const errors = {}
  const requiredFields = ['name']

  requiredFields.map(field => {
    if (!values.is_system && values && !values[field]) {
      errors[field] = messages.errors_required;
    }
  })

  return errors
}

class EditTokenForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showRevokeDialog: false
    }
  }

  handleRevoke = () => {
    this.setState({showRevokeDialog: true})
  }

  componentDidMount() {
    this.props.onLoad();
  }

  render() {
    let {handleSubmit, pristine, submitting, initialValues, tokenId, newToken, onDelete} = this.props;
    const isTokenAdded = !!newToken;
    const isAdd = tokenId === null || tokenId === undefined;

    return (
      <div>
        <form onSubmit={handleSubmit}>
        <Paper className="paper-box" zDepth={1}>
          <div className={style.innerBox}>
            <Field name="name" component={TextField} floatingLabelText={messages.settings_tokenName} fullWidth={true}/>
            <Field name="email" component={TextField} floatingLabelText={messages.email} fullWidth={true} disabled={!isAdd} type="email"/>
            <Field name="expiration" component={TextField} floatingLabelText={messages.settings_tokenExp} fullWidth={true} type="number"/>
            <div className="blue-title">{messages.settings_selectScopes}</div>
            <Field name="scopes" component={MultiSelect} items={Scopes} disabled={!isAdd}/>
          </div>
          <div className="buttons-box">
            {!isAdd &&
              <RaisedButton label={messages.settings_revokeAccess} secondary={true} style={{ float: 'left'}} onClick={this.handleRevoke} />
            }
            <RaisedButton type="submit" label={isAdd ? messages.settings_generateToken : messages.save} primary={true} className={style.button} disabled={pristine || submitting}/>
          </div>
          </Paper>
        </form>

        <ConfirmationDialog
          open={isTokenAdded}
          title={messages.settings_copyYourNewToken}
          description={newToken}
          submitLabel={messages.actions_done}
          cancelLabel={messages.cancel}
          modal={true}
         />

        <ConfirmationDialog
          open={this.state.showRevokeDialog}
          title={messages.settings_tokenRevokeTitle}
          description={messages.settings_tokenRevokeDescription}
          onSubmit={onDelete}
          submitLabel={messages.settings_revokeAccess}
          cancelLabel={messages.cancel}
        />
      </div>
    )
  }
}

export default reduxForm({form: 'EditTokenForm', validate, enableReinitialize: true})(EditTokenForm)
