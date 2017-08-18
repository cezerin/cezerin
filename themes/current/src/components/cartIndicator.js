import React from 'react';
import { NavLink } from 'react-router-dom'
import text from '../lib/text'
import config from '../lib/config'

export default class CartIndicator extends React.PureComponent {
  render() {
    const { cart } = this.props;
    if (cart && cart.items && cart.items.length > 0) {
      let itemsCount = 0;
      for(let item of cart.items) {
        itemsCount += item.quantity;
      }
      return <span className="tag icon is-danger cart-count">{itemsCount}</span>
    } else {
      return null;
    }
  }
}
