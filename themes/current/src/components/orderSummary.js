import React from 'react';
import {Link} from 'react-router'
import * as helper from '../lib/helper'
import text from '../lib/text'

const OrderSummaryItem = ({settings, item, deleteCartItem, updateCartItemQuantiry}) => {
  return (
    <div className="columns is-mobile">
      <div className="column is-3">
        <div className="image">
          <a><img src="https://store.cezerin.com/static/products/58b574a593223a427233ed9a/340/8.png" /></a>
        </div>
      </div>
      <div className="column">
        <a>{item.name}</a><br />
        <span>{text.qty}: {item.quantity}</span>
        <div className="mini-cart-item-price">{helper.formatCurrency(item.price_total, settings)}</div>
        <a className="button is-light is-small" onClick={() => deleteCartItem(item.id)}>{text.remove}</a>
      </div>
    </div>
  )
}

// <span className="select is-small" onChange={e => {updateCartItemQuantiry(item.id, e.target.value)}}>
//     <select>
//       <option>Select dropdown</option>
//     </select>
//   </span>

export default(props) => {
  const {cart, settings} = props.state;

  if (cart && cart.items && cart.items.length > 0) {
    let items = cart.items.map(item =>
      <OrderSummaryItem
        key={item.id}
        item={item}
        deleteCartItem={props.deleteCartItem}
        updateCartItemQuantiry={props.updateCartItemQuantiry}
        settings={settings}
      />
    );

    return (
      <div>
        {items}

        <div className="columns is-mobile is-gapless is-multiline">
          <div className="column is-7">{text.subtotal}</div>
          <div className="column is-5 has-text-right">
            {helper.formatCurrency(cart.subtotal, settings)}
          </div>
          <div className="column is-7">{text.shipping}</div>
          <div className="column is-5 has-text-right">
            {helper.formatCurrency(cart.shipping_total, settings)}
          </div>
          <div className="column is-7">{text.discount}</div>
          <div className="column is-5 has-text-right">
            {helper.formatCurrency(cart.discount_total, settings)}
          </div>
          <div className="column is-7">{text.grandTotal}</div>
          <div className="column is-5 has-text-right">
            {helper.formatCurrency(cart.grand_total, settings)}
          </div>
        </div>
      </div>
    )
  } else {
    return <div><p>{text.cartEmpty}</p></div>
  }
}
