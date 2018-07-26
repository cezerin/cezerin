import React from 'react';
import messages from 'lib/text';
import CezerinClient from 'cezerin-client';
import * as auth from 'lib/webstoreAuth';

import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

export default class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: localStorage.getItem('webstore_email') || '',
			isFetching: false,
			emailIsSent: false,
			error: null
		};
	}

	handleChange = event => {
		this.setState({
			email: event.target.value
		});
	};

	handleKeyPress = e => {
		if (e.keyCode === 13 || e.which === 13) {
			this.handleSubmit();
		}
	};

	handleSubmit = () => {
		this.setState({
			isFetching: true,
			emailIsSent: false,
			error: null
		});

		CezerinClient.authorizeInWebStore(
			this.state.email,
			location.origin + '/admin'
		).then(({ status, json }) => {
			this.setState({
				isFetching: false,
				emailIsSent: status === 200,
				error: status !== 200 && json ? json.message : null
			});
		});
	};

	componentWillMount() {
		auth.checkTokenFromUrl();
	}

	render() {
		const { email, isFetching, emailIsSent, error } = this.state;

		let response = null;
		if (isFetching) {
			response = (
				<div className="loginSuccessResponse">{messages.messages_loading}</div>
			);
		} else if (emailIsSent) {
			response = (
				<div className="loginSuccessResponse">{messages.loginLinkSent}</div>
			);
		} else if (emailIsSent === false && error) {
			response = <div className="loginErrorResponse">{error}</div>;
		}

		return (
			<div className="row col-full-height center-xs middle-xs">
				<div className="col-xs-12 col-sm-8 col-md-6 col-lg-4">
					<Paper className="loginBox" zDepth={1}>
						<div className="loginTitle">{messages.webstoreLoginTitle}</div>
						<div className="loginDescription">{messages.loginDescription}</div>
						<div className="loginInput">
							<TextField
								type="email"
								value={email}
								onChange={this.handleChange}
								onKeyPress={this.handleKeyPress}
								label={messages.email}
								fullWidth={true}
								hintStyle={{ width: '100%' }}
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
