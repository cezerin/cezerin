import React from 'react';
import {Link} from 'react-router'
import * as helper from '../lib/helper'
import text from '../lib/text'
import config from '../lib/config'

const MAX_CART_ITEM_QTY = 10;

const OrderSummaryItem = ({settings, item, deleteCartItem, updateCartItemQuantiry}) => {
  const thumbnail = helper.getThumbnailUrl(item.image_url, config.cart_thumbnail_width);
  const qtyOptions = [];
  const maxQty = item.stock_quantity >= MAX_CART_ITEM_QTY ? MAX_CART_ITEM_QTY : item.stock_quantity;

  for(let i = 0; i <= maxQty; i++){
    const optionText = i === 0 ? text.remove : i;
    qtyOptions.push(<option key={i} value={i}>{optionText}</option>)
  }

  return (
    <div className="columns is-mobile">
      <div className="column is-3">
        <div className="image">
          <img src={thumbnail} />
        </div>
      </div>
      <div className="column">
        <p>
          {item.name}
        </p>
        <div className="columns is-mobile is-gapless is-flex" style={{ alignItems: 'center' }}>
          <div className="column is-2">
            {text.qty}:
          </div>
          <div className="column">
            <span className="select is-small">
              <select onChange={e => {updateCartItemQuantiry(item.id, e.target.value)}} value={item.quantity}>
                {qtyOptions}
              </select>
            </span>
          </div>
          <div className="column is-5 has-text-right">
            {helper.formatCurrency(item.price_total, settings)}
          </div>
        </div>
      </div>
    </div>
  )
}

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
      <div className="checkout-box content is-small">
        <div className="title is-4">{text.orderSummary}</div>
        <hr className="separator" />
        {items}
        <hr className="separator" />
        <div className="columns is-mobile is-gapless is-multiline">
          <div className="column is-7">{text.subtotal}</div>
          <div className="column is-5 has-text-right">
            {helper.formatCurrency(cart.subtotal, settings)}
          </div>
          <div className="column is-7">{text.shipping}</div>
          <div className="column is-5 has-text-right">
            {helper.formatCurrency(cart.shipping_total, settings)}
          </div>

          {cart.discount_total > 0 &&
              <div className="column is-7">{text.discount}</div>
          }
          {cart.discount_total > 0 &&
            <div className="column is-5 has-text-right">
              {helper.formatCurrency(cart.discount_total, settings)}
            </div>
          }

          <div className="column is-12">
            <hr className="separator" />
          </div>
          <div className="column is-7"><b>{text.grandTotal}</b></div>
          <div className="column is-5 has-text-right">
            <b>{helper.formatCurrency(cart.grand_total, settings)}</b>
          </div>
        </div>
      </div>
    )
  } else {
    return <div>{text.cartEmpty}</div>
  }
}
