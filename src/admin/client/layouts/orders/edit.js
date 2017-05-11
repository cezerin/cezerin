import React from 'react'
import OrderDetails from 'modules/orders/edit';

export default ({ params }) => (
  <OrderDetails orderId={params.orderId} />
)
