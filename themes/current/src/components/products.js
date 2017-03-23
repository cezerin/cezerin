import React from 'react'
import {Link} from 'react-router'
import config from '../lib/config'
import * as helper from '../lib/helper'

const ProductsListItem = ({product, addCartItem, settings}) => {
  const imageUrl = (product.images && product.images.length > 0)
    ? helper.getThumbnailUrl(product.images[0].url, config.list_thumbnail_width)
    : config.imagePlaceholder;

  return (
    <div className="column is-half-mobile is-one-third-tablet">
      <div className="image">
        <Link to={product.path}>
          <img src={imageUrl} />
        </Link>
      </div>
      <div className="content has-text-centered">
        <Link to={product.path}>{product.name}</Link>
        <p>{helper.formatCurrency(product.price, settings)}</p>
      </div>
    </div>
  )
}

const ProductsList = ({products, addCartItem, settings}) => {
  let i = 0;
  const items = products.map(product => {
    i++;
    return <ProductsListItem key={i} product={product} addCartItem={addCartItem} settings={settings}/>
  })
  return (
    <div className="columns is-multiline is-mobile">
      {items}
    </div>
  )
}

export default ProductsList
