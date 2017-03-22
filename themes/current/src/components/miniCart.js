import React from 'react';
import {Link} from 'react-router'
import * as helper from '../lib/helper'
import text from '../lib/text'

const MiniCartItem = ({item, deleteCartItem, settings}) => {
  return (
    <div className="columns is-mobile">
      <div className="column is-2">
        <div className="image">
          <a><img src="https://store.cezerin.com/static/products/58b574a593223a427233ed9a/340/8.png" /></a>
        </div>
      </div>
      <div className="column">
        <a>{item.name}</a><br />
        <span>{text.qty}: {item.quantity}</span>
      </div>
      <div className="column is-4 has-text-right">
        <div className="mini-cart-item-price">{helper.formatCurrency(item.price_total, settings)}</div>
        <a className="button is-light is-small" onClick={() => deleteCartItem(item.id)}>{text.remove}</a>
      </div>
    </div>
  )
}

export default({cart, deleteCartItem, active, settings, cartToggle}) => {
  const rootClass = active ? "mini-cart active" : "mini-cart";

  if (cart && cart.items && cart.items.length > 0) {
    let items = cart.items.map(item =>
      <MiniCartItem key={item.id} item={item} deleteCartItem={deleteCartItem} settings={settings} />
    );

    return (
      <div className={rootClass}>
        {items}
        <hr className="separator" />
        <div className="columns is-mobile is-gapless">
          <div className="column is-7"><b>{text.subtotal}</b></div>
          <div className="column is-5 has-text-right">
            <b>{helper.formatCurrency(cart.subtotal, settings)}</b>
          </div>
        </div>
        <Link className="button is-primary is-fullwidth has-text-centered" style={{ textTransform: 'uppercase' }} to="/checkout" onClick={cartToggle}>{text.proceedToCheckout}</Link>
      </div>
    )
  } else {
    return <div className={rootClass}><p>{text.cartEmpty}</p></div>
  }
}
