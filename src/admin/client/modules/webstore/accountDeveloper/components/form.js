import React from 'react'
import {Field, reduxForm} from 'redux-form'
import {Link} from 'react-router-dom'
import {TextField} from 'redux-form-material-ui'

import { CustomToggle } from 'modules/shared/form'
import messages from 'lib/text'
import style from './style.css'

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';

class WebStoreAccountDeveloperForm extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.fetchData();
  }

  render() {
    let {handleSubmit, pristine, submitting, initialValues} = this.props;

    return (
        <form onSubmit={handleSubmit} style={{
          display: 'initial',
          width: '100%'
        }}>
        <Paper className="paper-box" zDepth={1}>
          <div className={style.innerBox}>
            <div>
              <Field component={TextField} fullWidth={true} name="name" floatingLabelText={messages.fullName} />
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="description" floatingLabelText={messages.description} multiLine={true} rows={1} />
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="website" floatingLabelText={messages.website} />
            </div>
            <div>
              <Field component={TextField} fullWidth={true} name="email" floatingLabelText={messages.email} />
            </div>
          </div>
          <div className="buttons-box">
            <RaisedButton type="submit" label={messages.save} primary={true} className={style.button} disabled={pristine || submitting}/>
          </div>
          </Paper>
        </form>
    )
  }
}

export default reduxForm({form: 'WebStoreAccountDeveloperForm', enableReinitialize: true})(WebStoreAccountDeveloperForm)
