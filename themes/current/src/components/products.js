import React from 'react'
import {Link} from 'react-router'
import Waypoint from 'react-waypoint'
import text from '../lib/text'
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

const LoadMore = ({ loadMoreProducts, hasMore }) => {
  return config.infiniteScrolling ? (
    <Waypoint onEnter={loadMoreProducts}/>
  ) : (
    <div className="load-more">
      {hasMore &&
        <button onClick={loadMoreProducts} className="button is-fullwidth">{text.loadMore}</button>
      }
    </div>
  )
}

const ProductsList = ({products, addCartItem, settings, loadMoreProducts, hasMore}) => {
  const items = products ? products.map((product, index) => {
    return <ProductsListItem key={index} product={product} addCartItem={addCartItem} settings={settings}/>
  }) : null;

  return (
    <div>
      <div className="columns is-multiline is-mobile" style={{ alignItems: 'baseline' }}>
        {items}
      </div>
      <LoadMore loadMoreProducts={loadMoreProducts} hasMore={hasMore} />
    </div>
  )
}

export default ProductsList
