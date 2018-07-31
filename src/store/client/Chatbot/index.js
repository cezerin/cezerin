import React from 'react';
import { ThemeProvider } from 'styled-components';
import ChatBot from 'react-simple-chatbot';
import ChatComponent from './Chat';
import api from '../api';
import merge from 'lodash/merge';

export default class Bot extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		steps: [
			{
				id: '1',
				message: '¡Hola! Me llamo Ubot. ¿En qué puedo ayudarte?',
				trigger: 'question'
			},
			{
				id: 'question',
				user: true,
				trigger: '3'
			}
		],
		theme: {}
	};

	async componentDidMount() {
		try {
			const { status, json } = await api.ajax.chatbotSettings.retrieve();
			const newState = merge(this.state, {
				theme: { ...json },
				steps: [
					{
						id: '3',
						component: <ChatComponent projectId={json._id} />,
						asMessage: true,
						trigger: 'question'
					}
				]
			});
			this.setState(newState);
		} catch (error) {
			console.log('Error getting Chatbot Settings:', error.message);
		}
	}

	render() {
		return (
			<ThemeProvider theme={this.state.theme}>
				<ChatBot floating steps={this.state.steps} />
			</ThemeProvider>
		);
	}
}
