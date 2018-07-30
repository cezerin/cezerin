import React, { Component } from 'react';

export default class Chat extends Component {
	state = {
		answers: []
	};

	async componentDidMount() {
		try {
			const { steps } = this.props;
			const question = steps.question.value;
			console.log('question:', question);
		} catch (error) {
			console.log(error);
		}
	}

	setDefaultAnswer() {
		this.setState({ answers: [{ answer: 'Creo que no te he entendido' }] });
	}

	render() {
		return <div>{this.state.answers.map(answer => answer.answer)}</div>;
	}
}
