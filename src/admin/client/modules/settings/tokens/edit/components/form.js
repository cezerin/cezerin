import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {TextField, Toggle} from 'redux-form-material-ui'

import messages from 'lib/text'
import style from './style.css'
import ConfirmationDialog from 'modules/shared/confirmation'
import SelectTokenScopes from './selectScopes'

import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

const Scopes = ['admin', 'read:products', 'write:products', 'read:orders', 'write:orders'];

const validate = values => {
  const errors = {}
  const requiredFields = ['name']

  requiredFields.map(field => {
    if (!values.is_system && values && !values[field]) {
      errors[field] = messages.errors.required;
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
            <Field name="name" component={TextField} floatingLabelText={messages.settings.tokenName} fullWidth={true}/>
            <Field name="email" component={TextField} floatingLabelText={messages.email} fullWidth={true} disabled={!isAdd} type="email"/>
            <Field name="expiration" component={TextField} floatingLabelText={messages.settings.tokenExp} fullWidth={true} type="number"/>
            <div className="blue-title">{messages.settings.selectScopes}</div>
            <Field name="scopes" component={SelectTokenScopes} scopes={Scopes} disabled={!isAdd}/>
          </div>
          <div style={{
            padding: 30,
            textAlign: 'right'
          }}>
            {!isAdd &&
              <RaisedButton label={messages.settings.revokeAccess} secondary={true} style={{ float: 'left'}} onTouchTap={this.handleRevoke} />
            }
            <RaisedButton type="submit" label={isAdd ? messages.settings.generateToken : messages.actions.save} primary={true} className={style.button} disabled={pristine || submitting}/>
          </div>
        </form>

        <ConfirmationDialog
          open={isTokenAdded}
          title={messages.settings.copyYourNewToken}
          description={newToken}
          submitLabel={messages.actions.done}
          cancelLabel={messages.actions.cancel}
          modal={true}
         />

        <ConfirmationDialog
          open={this.state.showRevokeDialog}
          title={messages.settings.tokenRevokeTitle}
          description={messages.settings.tokenRevokeDescription}
          onSubmit={() => { onDelete(this.props.tokenId) }}
          submitLabel={messages.settings.revokeAccess}
          cancelLabel={messages.actions.cancel}
        />
      </div>
    )
  }
}

export default reduxForm({form: 'EditTokenForm', validate, enableReinitialize: true})(EditTokenForm)
