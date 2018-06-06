import React from 'react'
import text from '../../text'
import CheckoutStepContacts from '../stepContacts'
import CheckoutStepShipping from '../stepShipping'
import CheckoutStepPayment from '../stepPayment'

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1
    };
  }

  componentDidMount() {
    this.props.onLoad();
  }

  handleContactsSave = () => {
    this.setState({
      step: 2
    });
  };

  handleContactsEdit = () => {
    this.setState({
      step: 1
    });
  };

  handleShippingSave = () => {
    this.setState({
      step: 3
    });
  };

  handleShippingEdit = () => {
    this.setState({
      step: 2
    });
  };

  render() {
    const { step } = this.state;
    const { cart, settings, themeSettings } = this.props;
    const {
      checkoutInputClass = 'checkout-field',
      checkoutButtonClass = 'checkout-button',
      checkoutEditButtonClass = 'checkout-button-edit'
    } = themeSettings;

    if (cart && cart.items.length > 0) {
      const { payment_method_gateway } = cart;
      const showPaymentForm = payment_method_gateway && payment_method_gateway !== '';

      return (
        <div className="checkout-form">
          <CheckoutStepContacts
            show={step >= 1}
            onSave={this.handleContactsSave}
            onEdit={this.handleContactsEdit}
            title={text.customerDetails}
            inputClassName={checkoutInputClass}
            buttonClassName={checkoutButtonClass}
            editButtonClassName={checkoutEditButtonClass}
          />

          <CheckoutStepShipping
            show={step >= 2}
            onSave={this.handleShippingSave}
            onEdit={this.handleShippingEdit}
            title={text.shipping}
            inputClassName={checkoutInputClass}
            buttonClassName={checkoutButtonClass}
            editButtonClassName={checkoutEditButtonClass}
          />

          {showPaymentForm &&
            <CheckoutStepPayment
              show={step === 3}
              title={text.payment}
              inputClassName={checkoutInputClass}
              buttonClassName={checkoutButtonClass}
            />
          }
        </div>
      )
    } else {
      return <p>{text.emptyCheckout}</p>
    }
  }
}
