import React from 'react';
import { Elements } from 'react-stripe-elements';
import InjectedCheckoutForm from './CheckoutForm';

const StoreCheckout = ({
	formSettings,
	shopSettings,
	onPayment,
	onCreateToken
}) => (
	<Elements>
		<InjectedCheckoutForm
			formSettings={formSettings}
			shopSettings={shopSettings}
			onPayment={onPayment}
			onCreateToken={onCreateToken}
		/>
	</Elements>
);

export default StoreCheckout;
