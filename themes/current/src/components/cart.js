import React from 'react';
import {Button, FormControl} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {Link} from 'react-router'

export default({cart, deleteCartItem, updateCartItemQuantiry}) => {
  if (cart && cart.items && cart.items.length > 0) {
    let items = cart.items.map(item => <tr key={item.id}>
      <td>{item.id} </td>
      <td>{item.name}, </td>
      <td>{item.price}</td>
      <td> x <FormControl componentClass="select" placeholder={item.quantity} onChange={e => {updateCartItemQuantiry(item.id, e.target.value)}}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </FormControl>
      </td>
      <td> = {item.price_total}</td>
      <td>
        <Button onClick={() => deleteCartItem(item.id)} bsStyle="default">Remove</Button>
      </td>
    </tr>);

    return (
      <div>
        <p>{cart.id}, {cart.shipping_method}, {cart.payment_method}</p>
        <table>
          <tbody>
            <tr>
              <td>id</td>
              <td>name</td>
              <td>price</td>
              <td>quantity</td>
              <td>price_total</td>
            </tr>
            {items}
          </tbody>
        </table>
        <p>Subtotal: {cart.sub_total}</p>
        <p>Shipping: {cart.shipping_total}</p>
        <p>Discount: {cart.discount_total}</p>
        <p>Tax: {cart.tax_total}</p>
        <p><b>Grand total: </b>{cart.grand_total}</p>
      </div>
    )
  } else {
    return <p>Cart is empty</p>
  }
}
