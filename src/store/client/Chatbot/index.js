import React from 'react';
import { ThemeProvider } from 'styled-components';
import ChatBot from 'react-simple-chatbot';
import ChatComponent from './Chat';
import api from '../api';

export default class Bot extends React.Component {
	constructor(props) {
		super(props);
	}

	steps = [
		{
			id: '1',
			message: '¡Hola! Me llamo Ubot. ¿En qué puedo ayudarte?',
			trigger: 'question'
		},
		{
			id: 'question',
			user: true,
			trigger: '3'
		},
		{
			id: '3',
			component: <ChatComponent />,
			asMessage: true,
			trigger: 'question'
		}
	];

	async componentDidMount() {
		console.log('API:', api);
		try {
			const { status, json } = await api.ajax.chatbotSettings.retrieve();
			console.log('settings:', json);
		} catch (error) {
			console.log('Error getting Chatbot Settings:', error.message);
		}
	}

	render() {
		return (
			<ThemeProvider theme={{}}>
				<ChatBot floating steps={this.steps} />
			</ThemeProvider>
		);
	}
}
