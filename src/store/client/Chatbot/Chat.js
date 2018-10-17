import React, { Component } from 'react';
import moment from 'moment';
import api from '../api';

export default class Chat extends Component {
	constructor(props) {
		super(props);
		this.sessionId = moment().format('DD-MM-YYYY-HH:mm:ss');
	}

	state = {
		answer: ''
	};

	async componentDidMount() {
		try {
			const { steps } = this.props;
			const question = steps.question.value;
			const {
				json: {
					json: { answer }
				}
			} = await api.ajax.chatbot.ask({
				question,
				sessionId: this.sessionId
			});
			this.setState({ answer });
		} catch (error) {
			console.log('Error getting answer:', error.message);
		}
	}

	setDefaultAnswer() {
		this.setState({ answers: [{ answer: 'Creo que no te he entendido' }] });
	}

	render() {
		return <div>{this.state.answer}</div>;
	}
}
