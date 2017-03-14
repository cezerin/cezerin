import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {TextField, Toggle} from 'redux-form-material-ui'

import messages from 'lib/text'
import style from './style.css'
import ConfirmationDialog from 'modules/shared/confirmation'
import SelectTokenScopes from './selectScopes'

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
  'read:themes',
  'write:themes',
  'read:sitemap',
  'read:shipping_methods',
  'write:shipping_methods',
  'read:payment_methods',
  'write:payment_methods',
  'read:settings',
  'write:settings'];

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
    this.props.onLoad(this.props.tokenId);
  }

  render() {
    let {handleSubmit, pristine, submitting, initialValues, isAdd, newToken, onDelete} = this.props;
    const isTokenAdded = !!newToken;

    return (
      <div className="row row--no-gutter col-full-height col--no-gutter scroll">
        <form onSubmit={handleSubmit} style={{
          display: 'initial',
          width: '100%'
        }}>
          <div className={style.innerBox}>
            <Field name="name" component={TextField} floatingLabelText={messages.settings_tokenName} fullWidth={true}/>
            <Field name="email" component={TextField} floatingLabelText={messages.email} fullWidth={true} disabled={!isAdd} type="email"/>
            <Field name="expiration" component={TextField} floatingLabelText={messages.settings_tokenExp} fullWidth={true} type="number"/>
            <div className="blue-title">{messages.settings_selectScopes}</div>
            <Field name="scopes" component={SelectTokenScopes} scopes={Scopes} disabled={!isAdd}/>
          </div>
          <div style={{
            padding: 30,
            textAlign: 'right'
          }}>
            {!isAdd &&
              <RaisedButton label={messages.settings_revokeAccess} secondary={true} style={{ float: 'left'}} onTouchTap={this.handleRevoke} />
            }
            <RaisedButton type="submit" label={isAdd ? messages.settings_generateToken : messages.actions_save} primary={true} className={style.button} disabled={pristine || submitting}/>
          </div>
        </form>

        <ConfirmationDialog
          open={isTokenAdded}
          title={messages.settings_copyYourNewToken}
          description={newToken}
          submitLabel={messages.actions_done}
          cancelLabel={messages.actions_cancel}
          modal={true}
         />

        <ConfirmationDialog
          open={this.state.showRevokeDialog}
          title={messages.settings_tokenRevokeTitle}
          description={messages.settings_tokenRevokeDescription}
          onSubmit={() => { onDelete(this.props.tokenId) }}
          submitLabel={messages.settings_revokeAccess}
          cancelLabel={messages.actions_cancel}
        />
      </div>
    )
  }
}

export default reduxForm({form: 'EditTokenForm', validate, enableReinitialize: true})(EditTokenForm)
