import React from 'react'
import { NavLink } from 'react-router-dom'
import Waypoint from 'react-waypoint'
import text from '../lib/text'
import config from '../lib/config'
import * as helper from '../lib/helper'

const ItemPrice = ({ product, settings }) => {
  if(product.on_sale) {
    return (
      <div>
        <del className="product-old-price">{helper.formatCurrency(product.regular_price, settings)}</del>
        <span className="product-new-price">{helper.formatCurrency(product.price, settings)}</span>
      </div>
    )
  } else {
    return (
      <div>
        {helper.formatCurrency(product.price, settings)}
      </div>
    )
  }
}

const ItemImage = ({ images, alt }) => {
  if(images && images.length > 0) {
    const imageUrl = helper.getThumbnailUrl(images[0].url, config.listThumbnailWidth);

    return (
      <img src={imageUrl} alt={alt} />
    )
  } else {
    return (
      <div className="small-image-placeholder"></div>
    )
  }
}

const ListItem = ({product, addCartItem, settings}) => {
  return (
    <div className="column is-6-mobile is-4-tablet">
      <div className="card">
        <div className="card-image">
          <figure className="image">
            <NavLink to={product.path}>
              <ItemImage images={product.images} alt={product.name} />
            </NavLink>
          </figure>
        </div>
        <div className="card-content">
          <div className="content">
            <NavLink to={product.path}>{product.name}</NavLink>
            <ItemPrice product={product} settings={settings} />
          </div>
        </div>
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
        <button onClick={loadMoreProducts} className="button is-fullwidth is-dark">{text.loadMore}</button>
      }
    </div>
  )
}

const ProductList = ({products, addCartItem, settings, loadMoreProducts, hasMore}) => {
  const items = products ? products.map((product, index) => {
    return <ListItem key={index} product={product} addCartItem={addCartItem} settings={settings}/>
  }) : null;

  return (
    <div>
      <div className="columns is-multiline is-mobile" style={{ alignItems: 'flex-start' }}>
        {items}
      </div>
      <LoadMore loadMoreProducts={loadMoreProducts} hasMore={hasMore} />
    </div>
  )
}

export default ProductList
