import React from 'react';
import api from 'lib/api';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import messages from 'lib/text';

export const Description = {
	key: 'uBot-chatbot',
	name: 'uBot Chatbot',
	coverUrl: '/admin-assets/images/apps/logoUTIPS.png',
	description: `Servicio de chatbot automatizado:
  <ol>
    <li>Respuestas automáticas</li>
  </ol>
  `
};

export class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			projectId: '',
			locale: 'es_CL'
		};
	}

	handleProjectIdChange = event => {
		this.setState({ projectId: event.target.value });
	};

	handleLocaleChange = event => {
		this.setState({ locale: event.target.value });
	};

	fetchSettings = () => {
		api.apps.settings
			.retrieve('ubot-chatbot')
			.then(({ status, json }) => {
				const appSettings = json;
				if (appSettings) {
					this.setState({
						projectId: appSettings.projectId,
						locale: appSettings.locale
					});
				}
			})
			.catch(error => {
				console.log(error);
			});
	};

	updateSettings = () => {
		const { projectId, locale } = this.state;
		api.apps.settings.update('ubot-chatbot', {
			projectId: projectId,
			locale: locale
		});
	};

	componentDidMount() {
		this.fetchSettings();
	}

	render() {
		return (
			<div>
				<div>You can find Project ID using the DialogFlow Console.</div>

				<TextField
					type="text"
					fullWidth={true}
					value={this.state.projectId}
					onChange={this.handleProjectIdChange}
					floatingLabelText="Project ID"
				/>

				<TextField
					type="text"
					fullWidth={true}
					value={this.state.locale}
					onChange={this.handleLocaleChange}
					floatingLabelText="Locale"
					hintText="es_CL"
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
