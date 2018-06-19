import React from 'react';
import {IbanElement, CardElement} from 'react-stripe-elements';

class CardSection extends React.Component {
  render() {
    return (
      <label>
        Credit Card details
        <CardElement />
      </label>
    );
  }
}

export default CardSection;
