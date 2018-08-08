import React from 'react';
import { StripeProvider } from 'react-stripe-elements';
import StoreCheckout from './StoreCheckout';

export default class StripeElements extends React.Component {
	constructor(props) {
		super(props);
		this.state = { stripe: null };
	}

	componentDidMount() {
		const SCRIPT_URL = 'https://js.stripe.com/v3/';
		const container = document.body || document.head;
		const script = document.createElement('script');
		script.src = SCRIPT_URL;
		script.async = true;
		script.onload = () => {
			this.setState({
				stripe: window.Stripe(this.props.formSettings.public_key)
			});
		};
		container.appendChild(script);
	}

	render() {
		const { formSettings, shopSettings, onPayment, onCreateToken } = this.props;
		return (
			<StripeProvider stripe={this.state.stripe}>
				<StoreCheckout
					formSettings={formSettings}
					shopSettings={shopSettings}
					onPayment={onPayment}
					onCreateToken={onCreateToken}
				/>
			</StripeProvider>
		);
	}
}
