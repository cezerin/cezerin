import React from 'react';
import messages from 'lib/text';
import api from 'lib/api';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export const Description = {
	key: 'facebook-sdk',
	name: 'Facebook SDK',
	coverUrl: '/admin-assets/images/apps/facebook.png',
	description: `The Facebook SDK for JavaScript provides a rich set of client-side functionality that:
  <ol>
    <li>Enables you to use the Like Button and other Social Plugins on your site.</li>
    <li>Enables you to use Facebook Login to lower the barrier for people to sign up on your site.</li>
    <li>Makes it easy to call into Facebook's Graph API.</li>
    <li>Launch Dialogs that let people perform various actions like sharing stories.</li>
    <li>Facilitates communication when you're building a game or an app tab on Facebook.</li>
  </ol>
  <p>The Facebook SDK for JavaScript doesn't have any standalone files that need to be downloaded or installed, instead you simply need to include a short piece of regular JavaScript in your HTML that will asynchronously load the SDK into your pages. The async load means that it does not block loading other elements of your page.</p>`
};

const FACEBOOK_CODE = `<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId            : 'YOUR_APP_ID',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v2.11'
    });
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/YOUR_LOCALE/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script>`;

export class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			appId: '',
			locale: 'en_US'
		};
	}

	handleAppIdChange = event => {
		this.setState({ appId: event.target.value });
	};

	handleLocaleChange = event => {
		this.setState({ locale: event.target.value });
	};

	fetchSettings = () => {
		api.apps.settings
			.retrieve('facebook-sdk')
			.then(({ status, json }) => {
				const appSettings = json;
				if (appSettings) {
					this.setState({
						appId: appSettings.appId,
						locale: appSettings.locale
					});
				}
			})
			.catch(error => {
				console.log(error);
			});
	};

	updateSettings = () => {
		const { appId, locale } = this.state;
		const htmlCode =
			appId && appId.length > 0
				? FACEBOOK_CODE.replace(/YOUR_APP_ID/g, appId).replace(
						/YOUR_LOCALE/g,
						locale
				  )
				: '';

		api.apps.settings.update('facebook-sdk', { appId: appId, locale: locale });
		api.theme.placeholders.update('facebook-sdk', {
			place: 'body_start',
			value: htmlCode
		});
	};

	componentDidMount() {
		this.fetchSettings();
	}

	render() {
		return (
			<div>
				<div>You can find App ID using the Facebook App Dashboard.</div>

				<TextField
					type="text"
					fullWidth={true}
					value={this.state.appId}
					onChange={this.handleAppIdChange}
					floatingLabelText="App ID"
				/>

				<TextField
					type="text"
					fullWidth={true}
					value={this.state.locale}
					onChange={this.handleLocaleChange}
					floatingLabelText="Locale"
					hintText="en_US"
				/>

				<div style={{ textAlign: 'right' }}>
					<RaisedButton
						label={messages.save}
						primary={true}
						disabled={false}
						onClick={this.updateSettings}
					/>
				</div>
			</div>
		);
	}
}
