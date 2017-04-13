import React from 'react'
import ProductOption from 'modules/products/edit/option'

export default ({ productId, params }) => (
  <ProductOption productId={productId} optionId={params.optionId} />
)
