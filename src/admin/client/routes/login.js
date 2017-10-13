import React from 'react'
import messages from 'lib/text'
import CezerinClient from 'cezerin-client';
import settings from 'lib/settings';
import * as auth from 'lib/auth'

import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField';

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: localStorage.getItem('dashboard_email') || '',
    	isFetching: false,
    	isAuthorized: false,
    	emailIsSent: false,
    	error: null
    };
  }

  handleChange = (event) => {
    this.setState({
      email: event.target.value
    });
  };

  handleKeyPress = (e) => {
    if (e.keyCode === 13 || e.which === 13) {
      this.handleSubmit();
    }
  }

  handleSubmit = () => {
    this.setState({
      isFetching: true,
      isAuthorized: false,
      emailIsSent: false,
      error: null
    });

    CezerinClient.authorize(settings.apiBaseUrl, this.state.email)
    .then(authorizeResponse => {
      this.setState({
        isFetching: false,
        isAuthorized: false,
        emailIsSent: authorizeResponse.json.sent,
        error: authorizeResponse.json.error
      });
    })
    .catch(error => {
      this.setState({
        isFetching: false,
        isAuthorized: false,
        emailIsSent: false,
        error: error
      });
    });
  }

  componentWillMount() {
    auth.checkTokenFromUrl();
  }
  componentDidMount() {}

  render() {
    const {
      email,
      isFetching,
    	isAuthorized,
    	emailIsSent,
    	error
    } = this.state;

    let response = null;
    if(isFetching){
      response = <div className="loginSuccessResponse">{messages.messages_loading}</div>;
    } else if (emailIsSent) {
      response = <div className="loginSuccessResponse">{messages.loginLinkSent}</div>;
    } else if(emailIsSent === false && error) {
      response = <div className="loginErrorResponse">{error}</div>;
    }

    return (
      <div className="row col-full-height center-xs middle-xs">
        <div className="col-xs-12 col-sm-8 col-md-6 col-lg-4">
          <Paper className="loginBox" zDepth={1}>
            <div className="loginTitle">{messages.loginTitle}</div>
            <div className="loginDescription">{messages.loginDescription}</div>
            <div className="loginInput">
              <TextField
                type='email'
                value={email}
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
                label={messages.email}
                fullWidth={true}
                hintStyle={{width: '100%'}}
                hintText={messages.email}
              />
            </div>
            <RaisedButton
              label={messages.loginButton}
              primary={true}
              disabled={isFetching || emailIsSent}
              onClick={this.handleSubmit}
            />
            {response}
          </Paper>
        </div>
      </div>
    );
  }
}
