import React from 'react';
import {Elements} from 'react-stripe-elements';

import InjectedCheckoutForm from './CheckoutForm';

class StoreCheckout extends React.Component {
  render() {
    const { formSettings, shopSettings, onPayment, onCreateToken } = this.props;

    return (
      <Elements>
        <InjectedCheckoutForm formSettings={formSettings} shopSettings={shopSettings} onPayment={onPayment} onCreateToken={onCreateToken} />
      </Elements>
    );
  }
}

export default StoreCheckout;