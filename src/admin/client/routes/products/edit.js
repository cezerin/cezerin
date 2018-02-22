import React from 'react'
import { Route } from 'react-router-dom'
import ProductEdit from 'modules/products/edit'
import ProductOption from 'modules/products/edit/option'

const ProductDetails = (props) => {
  return (
    <div className="row row--no-gutter col-full-height scroll">
      <div className="col-xs-12 col-sm-12 col-md-10 col-lg-8 col-md-offset-1 col-lg-offset-2">
        <Route path="/admin/product/:productId" exact component={ProductEdit}/>
        <Route path="/admin/product/:productId/option/:optionId" component={ProductOption}/>
      </div>
    </div>
  )
}

export default ProductDetails;
