import React from 'react'
import ProductsEdit from 'modules/products/edit';

export default ({ params }) => (
  <ProductsEdit productId={params.id} />
)
