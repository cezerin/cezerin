import React from 'react'
import text from '../../text'
import { formatCurrency } from '../../lib/helper'
import PaymentForm from '../paymentForm'

export default class CheckoutStepPayment extends React.Component {
  render() {
    const {
      cart,
      settings,
      processingCheckout,
      finishCheckout,
      inputClassName,
      buttonClassName
    } = this.props;

    const { payment_method_gateway, grand_total } = cart;

    if(!this.props.show){
      return (
        <div className="checkout-step">
          <h1><span>3</span>{this.props.title}</h1>
        </div>
      )
    } else {
      return (
        <div className="checkout-step">
          <h1><span>3</span>{this.props.title}</h1>
          <div className="checkout-button-wrap">
            {!processingCheckout &&
              <PaymentForm
                gateway={payment_method_gateway}
                amount={grand_total}
                shopSettings={settings}
                onPayment={finishCheckout}
                inputClassName={inputClassName}
                buttonClassName={buttonClassName}
              />
            }
            {processingCheckout &&
              <p>{text.loading}</p>
            }
          </div>
        </div>
      )
    }
  }
}
