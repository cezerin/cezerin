import React from 'react';
import { NavLink } from 'react-router-dom'
import text from '../lib/text'
import config from '../lib/config'

const CartIndicator = ({cart}) => {
  if (cart && cart.items && cart.items.length > 0) {
    let itemsCount = 0;
    for(let item of cart.items) {
      itemsCount += item.quantity;
    }
    return <span className="tag is-danger">{itemsCount}</span>
  } else {
    return <span></span>
  }
}

export default CartIndicator
