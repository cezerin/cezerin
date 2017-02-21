import React from 'react'
import CheckoutFields from 'modules/settings/checkoutFields'

export default({ params }) => (
  <CheckoutFields fieldName={params.fieldName} />
)
