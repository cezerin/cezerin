import React from 'react'
import { Route } from 'react-router-dom'
import PageEdit from 'modules/pages/edit'

const ProductDetails = (props) => {
  return (
    <div className="row row--no-gutter col-full-height scroll">
      <div className="col-xs-8 col-xs-offset-2">
        <PageEdit {...props} />
      </div>
    </div>
  )
}

export default ProductDetails;
