import React from 'react'
import {Link} from 'react-router'

export default(props) =>  {
  const { order } = props;
  if (order && order.items.length > 0) {
    return (
      <div>
        <h1>Thank you, {order.shipping_address.full_name}!</h1>
        <p>{order.email}</p>
      </div>
    )
  } else {
    return <p>No data</p>
  }
}
