import React from 'react';
import api from '../../../lib/api';
import PayPalCheckout from './PayPalCheckout';
import LiqPay from './LiqPay';
import StripeElements from './StripeElements';

export default class PaymentForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			formSettings: null,
			loading: false
		};
	}

	fetchFormSettings = () => {
		this.setState({
			loading: true
		});

		api.ajax.paymentFormSettings
			.retrieve()
			.then(({ status, json }) => {
				this.setState({
					formSettings: json,
					loading: false
				});
			})
			.catch(e => {
				this.setState({
					formSettings: null,
					loading: false
				});
				console.log(e);
			});
	};

	componentDidMount() {
		this.fetchFormSettings();
	}

	componentWillReceiveProps(nextProps) {
		if (
			nextProps.gateway !== this.props.gateway ||
			nextProps.amount !== this.props.amount
		) {
			this.fetchFormSettings();
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (
			nextProps.gateway !== this.props.gateway ||
			nextProps.amount !== this.props.amount ||
			this.state !== nextState
		);
	}

	render() {
		const { gateway, shopSettings, onPayment, onCreateToken } = this.props;
		const { formSettings, loading } = this.state;

		if (loading) {
			return null;
		} else if (formSettings && gateway && gateway !== '') {
			switch (gateway) {
				case 'paypal-checkout':
					return (
						<div className="payment-form">
							<PayPalCheckout
								formSettings={formSettings}
								shopSettings={shopSettings}
								onPayment={onPayment}
							/>
						</div>
					);
				case 'liqpay':
					return (
						<div className="payment-form">
							<LiqPay
								formSettings={formSettings}
								shopSettings={shopSettings}
								onPayment={onPayment}
							/>
						</div>
					);
				case 'stripe-elements':
					return (
						<div className="payment-form">
							<StripeElements
								formSettings={formSettings}
								shopSettings={shopSettings}
								onPayment={onPayment}
								onCreateToken={onCreateToken}
							/>
						</div>
					);
				default:
					return (
						<div>
							Payment Gateway <b>{gateway}</b> not found!
						</div>
					);
			}
		} else {
			return null;
		}
	}
}
