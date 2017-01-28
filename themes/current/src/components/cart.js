import React from 'react';
import {Button} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import {Link} from 'react-router'

export default({cart, removeFromCart}) => {
  if (cart && cart.items && cart.items.length > 0) {
    let items = cart.items.map(item => <tr key={item.id}>
      <td>{item.id} </td>
      <td>{item.name}, </td>
      <td>{item.price}</td>
      <td> x {item.quantity}</td>
      <td> = {item.price_total}</td>
      <td>
        <Button onClick={() => removeFromCart(item.id)} bsStyle="default">Remove</Button>
      </td>
    </tr>);
    return (
      <div>
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
        <p>sub_total: {cart.sub_total}</p>
        <p>grand_total: {cart.grand_total}</p>
        <p>weight_total: {cart.weight_total}</p>
        <p>tax_total: {cart.tax_total}</p>
      </div>
    )
  } else {
    return <p>Cart is empty</p>
  }
}
