import React from 'react'
import { Route } from 'react-router-dom'
import ProductEdit from 'modules/products/edit'
import ProductOption from 'modules/products/edit/option'

const ProductDetails = (props) => {
  return (
    <div className="row row--no-gutter col-full-height scroll">
      <div className="col-xs-8 col-xs-offset-2">
        <Route path="/admin/product/:productId" exact component={ProductEdit}/>
        <Route path="/admin/product/:productId/option/:optionId" component={ProductOption}/>
      </div>
    </div>
  )
}

export default ProductDetails;
