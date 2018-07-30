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
			// if (question) {
			//   var response = await fetch(
			//     botConfig.apiURL, {
			//       method: 'POST',
			//       headers: {
			//         Accept: 'application/json',
			//         'Content-Type': 'application/json',
			//         'Ocp-Apim-Subscription-Key': botConfig.apiKey
			//       },
			//       body: JSON.stringify({
			//         'question': `${question}`
			//       })
			//     })
			//   response = await response.json()
			//   if (response.answers.length) {
			//     if (response.answers[0].score <= 40) {
			//       this.setDefaultAnswer()
			//     } else {
			//       this.setState({ answers: fixVowels(response.answers) })
			//     }
			//   } else {
			//     this.setDefaultAnswer()
			//   }
			// }
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
