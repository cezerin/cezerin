import React from 'react';
import { NavLink } from 'react-router-dom'
import { themeSettings, text } from '../lib/settings'
import * as helper from '../lib/helper'

const CheckoutSuccess = ({ order, settings, pageDetails }) => {
  if (order && order.items && order.items.length > 0) {
    const items = order.items.map((item, index) => (
      <div key={index} className="columns is-mobile is-gapless checkout-success-row">
        <div className="column is-6">
          {item.name}<br />
          <span>{item.variant_name}</span>
        </div>
        <div className="column is-2 has-text-right">{helper.formatCurrency(item.price, settings)}</div>
        <div className="column is-2 has-text-centered">{item.quantity}</div>
        <div className="column is-2 has-text-right">{helper.formatCurrency(item.price_total, settings)}</div>
      </div>
    ));

    return (
      <div className="checkout-success-details">

        <h1 className="checkout-success-title">
          <img src="/assets/images/success.svg" /><br />
          {text.checkoutSuccessTitle}
        </h1>

        <div dangerouslySetInnerHTML={{
          __html: pageDetails.content
        }}/>

        <hr />

        <div className="columns" style={{ marginBottom: '3rem' }}>

          <div className="column is-6">
            <div><b>{text.shippingAddress}</b></div>
            <div>{order.shipping_address.full_name}</div>
            <div>{order.shipping_address.company}</div>
            <div>{order.shipping_address.address1}</div>
            <div>{order.shipping_address.address2}</div>
            <div>{order.shipping_address.city}, {order.shipping_address.state && order.shipping_address.state.length > 0 ? order.shipping_address.state + ', ' : ''}{order.shipping_address.postal_code}</div>
            <div>{order.shipping_address.phone}</div>
          </div>

          <div className="column is-6">
            <b>{text.orderNumber}</b>: {order.number}<br />
            <b>{text.shippingMethod}</b>: {order.shipping_method}<br />
            <b>{text.paymentMethod}</b>: {order.payment_method}<br />
          </div>

        </div>

        <div className="columns is-mobile is-gapless checkout-success-row">
          <div className="column is-6"><b>{text.productName}</b></div>
          <div className="column is-2 has-text-right"><b>{text.price}</b></div>
          <div className="column is-2 has-text-centered"><b>{text.qty}</b></div>
          <div className="column is-2 has-text-right"><b>{text.total}</b></div>
        </div>

        {items}

        <div className="columns">
          <div className="column is-offset-7 checkout-success-totals">
            <div><span>{text.subtotal}:</span><span>{helper.formatCurrency(order.subtotal, settings)}</span></div>
            <div><span>{text.shipping}:</span><span>{helper.formatCurrency(order.shipping_total, settings)}</span></div>
            <div><b>{text.grandTotal}:</b><b>{helper.formatCurrency(order.grand_total, settings)}</b></div>
          </div>
        </div>

      </div>
    )
  } else {
    return null;
  }
}

export default CheckoutSuccess
