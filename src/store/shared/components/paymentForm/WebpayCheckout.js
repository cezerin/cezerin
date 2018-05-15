import React from 'react'
import text from '../../text'
import { formatCurrency } from '../../lib/helper'
// import WebPay from 'webpay-purejs'

export default class WebpayCheckout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { formSettings, shopSettings, onPayment } = this.props;
    return (
      <div id="webpay_checkout">
        Hello WebPay!
      </div>
    )
  }
}
