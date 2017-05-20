import React from 'react'
import CustomerDetails from 'modules/customers/edit';

export default ({ params }) => (
  <CustomerDetails customerId={params.customerId} />
)
