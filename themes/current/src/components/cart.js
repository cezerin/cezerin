import React from 'react';
import { NavLink } from 'react-router-dom'
import text from '../lib/text'
import config from '../lib/config'
import * as helper from '../lib/helper'

const CartItem = ({item, deleteCartItem, settings}) => {
  const thumbnail = helper.getThumbnailUrl(item.image_url, config.cart_thumbnail_width);

  return (
    <div className="columns is-mobile">
      <div className="column is-2">
        <div className="image">
          <NavLink to={item.path}><img src={thumbnail} /></NavLink>
        </div>
      </div>
      <div className="column">
        <div><NavLink to={item.path}>{item.name}</NavLink></div>
        {item.variant_name.length > 0 &&
          <div className="cart-option-name">{item.variant_name}</div>
        }
        <div>{text.qty}: {item.quantity}</div>
      </div>
      <div className="column is-4 has-text-right">
        <div className="mini-cart-item-price">{helper.formatCurrency(item.price_total, settings)}</div>
        <a className="button is-light is-small" onClick={() => deleteCartItem(item.id)}>{text.remove}</a>
      </div>
    </div>
  )
}

const Cart = ({cart, deleteCartItem, active, settings, cartToggle}) => {
  const rootClass = active ? "mini-cart active" : "mini-cart";

  if (cart && cart.items && cart.items.length > 0) {
    let items = cart.items.map(item =>
      <CartItem key={item.id} item={item} deleteCartItem={deleteCartItem} settings={settings} />
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
        <NavLink className="button is-primary is-fullwidth has-text-centered" style={{ textTransform: 'uppercase' }} to="/checkout" onClick={cartToggle}>{text.proceedToCheckout}</NavLink>
      </div>
    )
  } else {
    return <div className={rootClass}><p>{text.cartEmpty}</p></div>
  }
}

export default Cart
