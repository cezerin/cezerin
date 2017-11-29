import React from 'react';
import { NavLink } from 'react-router-dom'
import { themeSettings, text } from '../lib/settings'

export default class CartIndicator extends React.PureComponent {
  render() {
    const { cart, onClick } = this.props;
    if (cart && cart.items && cart.items.length > 0) {
      let itemsCount = 0;
      for(let item of cart.items) {
        itemsCount += item.quantity;
      }
      return <span className="cart-button" onClick={onClick}>
        <img src="/assets/images/shopping-bag.svg" className="icon" alt={text.cart} title={text.cart} style={{ minWidth: 24 }}/>
        <span className="tag icon is-danger cart-count">{itemsCount}</span>
      </span>
    } else {
      // cart is empty
      return <span className="cart-button" onClick={onClick}>
        <img src="/assets/images/shopping-bag.svg" className="icon" alt={text.cart} title={text.cart} style={{ minWidth: 24 }}/>
      </span>
    }
  }
}
