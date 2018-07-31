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

	handleChange = event => {
		console.log('event:', event.target, '\n');
		const newState = {};
		newState[event.target.id] = event.target.value;
		this.setState(newState);
	};

	handleLocale = event => {
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
					id="projectId"
					fullWidth={true}
					value={this.state.projectId}
					onChange={this.handleChange}
					floatingLabelText="Project ID"
				/>

				<TextField
					type="text"
					id="background"
					fullWidth={true}
					value={this.state.background}
					onChange={this.handleChange}
					floatingLabelText="Chat window background color"
				/>

				<TextField
					type="text"
					id="fontFamily"
					fullWidth={true}
					value={this.state.fontFamily}
					onChange={this.handleChange}
					floatingLabelText="Chat text font type"
				/>

				<TextField
					type="text"
					id="headerBgColor"
					fullWidth={true}
					value={this.state.headerBgColor}
					onChange={this.handleChange}
					floatingLabelText="Headers background color"
				/>

				<TextField
					type="text"
					id="headerFontColor"
					fullWidth={true}
					value={this.state.headerFontColor}
					onChange={this.handleChange}
					floatingLabelText="Color for header text"
				/>

				<TextField
					type="text"
					id="headerFontSize"
					fullWidth={true}
					value={this.state.headerFontSize}
					onChange={this.handleChange}
					floatingLabelText="Size for the chat text"
				/>

				<TextField
					type="text"
					id="botBubbleColor"
					fullWidth={true}
					value={this.state.botBubbleColor}
					onChange={this.handleChange}
					floatingLabelText="Bot bubble color"
				/>

				<TextField
					type="text"
					id="botFontColor"
					fullWidth={true}
					value={this.state.botFontColor}
					onChange={this.handleChange}
					floatingLabelText="Bot font color"
				/>

				<TextField
					type="text"
					id="userBubbleColor"
					fullWidth={true}
					value={this.state.userBubbleColor}
					onChange={this.handleChange}
					floatingLabelText="User bubble color"
				/>

				<TextField
					type="text"
					id="userFontColor"
					fullWidth={true}
					value={this.state.userFontColor}
					onChange={this.handleChange}
					floatingLabelText="Users font color"
				/>

				<TextField
					type="text"
					id="locale"
					fullWidth={true}
					value={this.state.locale}
					onChange={this.handleChange}
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
