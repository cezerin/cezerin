import React from 'react';
import api from '../../../../../src/store/client/api';

export default class TransbankWebpayCheckout extends React.Component {
	constructor(props) {
		super(props);
		this.formSettings = props.formSettings;
		this.shopSettings = props.shopSettings;
		this.onPayment = props.onPayment;
		this.state = {
			inProgress: false
		};
		this.submit = this.submit.bind(this);
	}

	async submit(event) {
		this.setState({
			inProgress: true
		});
		try {
			console.log('api:', api.ajax, '\n');
			const response = await api.ajax.webpay.pay(formSettings);
			console.log('response:', response);
			// location.assign(redirectURL)
			// await this.onPayment()
		} catch (error) {
			console.log('Error processing payment:', error.message);
		}
		this.setState({ inProgress: false });
	}

	render() {
		const { inProgress } = this.state;
		return (
			<div>
				<button
					onClick={this.submit}
					disabled={inProgress}
					className={`checkout-button button is-primary${
						inProgress ? ' is-loading' : ''
					}`}
				>
					Pagar!
				</button>
			</div>
		);
	}
}
