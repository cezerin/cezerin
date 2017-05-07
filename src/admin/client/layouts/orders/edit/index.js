import React from 'react'
import OrderDetails from 'modules/orders/edit/details';

export default ({ params }) => (
  <OrderDetails orderId={params.orderId} />
)
