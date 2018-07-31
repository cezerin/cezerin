import React, { Component } from 'react';
import moment from 'moment';
import api from '../api';

export default class Chat extends Component {
	constructor(props) {
		super(props);
		this.sessionId = moment().format('DD-MM-YYYY-HH:mm:ss');
	}

	state = {
		answers: []
	};

	async componentDidMount() {
		try {
			const { steps } = this.props;
			const question = steps.question.value;
			const answer = await api.ajax.chatbotSettings.retrieve('/chatbot/ask', {
				question,
				sessionId: this.sessionId
			});
			console.log('answer:', answer, '\n');
		} catch (error) {
			console.log('Error getting answer:', error.message);
		}
	}

	setDefaultAnswer() {
		this.setState({ answers: [{ answer: 'Creo que no te he entendido' }] });
	}

	render() {
		console.log('api:', api, '\n');
		return <div>{this.state.answers.map(answer => answer.answer)}</div>;
	}
}
