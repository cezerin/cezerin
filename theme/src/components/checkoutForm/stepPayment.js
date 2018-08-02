import React from 'react';
import { themeSettings, text } from '../../lib/settings';
import PaymentForm from './paymentForm';

export default class CheckoutStepPayment extends React.Component {
	render() {
		const {
			cart,
			settings,
			processingCheckout,
			handleSuccessPayment,
			inputClassName,
			buttonClassName,
			show,
			title,
			onCreateToken
		} = this.props;

		const { payment_method_gateway, grand_total } = cart;

		if (!show) {
			return (
				<div className="checkout-step">
					<h1>
						<span>3</span>
						{title}
					</h1>
				</div>
			);
		} else {
			return (
				<div className="checkout-step">
					<h1>
						<span>3</span>
						{title}
					</h1>
					<div className="checkout-button-wrap">
						{!processingCheckout && (
							<PaymentForm
								gateway={payment_method_gateway}
								amount={grand_total}
								shopSettings={settings}
								onPayment={handleSuccessPayment}
								inputClassName={inputClassName}
								buttonClassName={buttonClassName}
								onCreateToken={onCreateToken}
							/>
						)}
						{processingCheckout && <p>{text.loading}</p>}
					</div>
				</div>
			);
		}
	}
}
