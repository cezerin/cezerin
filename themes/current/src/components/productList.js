import React from 'react'
import { NavLink } from 'react-router-dom'
import text from '../lib/text'
import config from '../lib/config'
import * as helper from '../lib/helper'

const ItemPrice = ({ product, settings }) => {
  if(product.on_sale) {
    return (
      <div className="product-price">
        <span className="product-new-price">{helper.formatCurrency(product.price, settings)}</span>
        <del className="product-old-price">{helper.formatCurrency(product.regular_price, settings)}</del>
      </div>
    )
  } else {
    return (
      <div className="product-price">
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

const ListItem = ({product, addCartItem, settings, columnCountOnMobile, columnCountOnDesktop}) => {
  columnCountOnMobile = columnCountOnMobile || 2;
  columnCountOnDesktop = columnCountOnDesktop || 3;
  const columnCount = 12;
  const columnSizeOnMobile = columnCount / columnCountOnMobile;
  const columnSizeOnDesktop = columnCount / columnCountOnDesktop;

  return (
    <div className={`column is-${columnSizeOnMobile}-mobile is-${columnSizeOnDesktop}-tablet`}>
      <NavLink to={product.path}>
        <figure className="image">
          <ItemImage images={product.images} alt={product.name} />
        </figure>
        <div className="content product-caption">
          <div className="product-name">{product.name}</div>
          <ItemPrice product={product} settings={settings} />
        </div>
      </NavLink>
    </div>
  )
}

const LoadMore = ({ loadMoreProducts, hasMore }) => {
  return (
    <div className="load-more">
      {hasMore &&
        <button onClick={loadMoreProducts} className="button is-fullwidth is-dark">{text.loadMore}</button>
      }
    </div>
  )
}

const ProductList = ({products, addCartItem, settings, loadMoreProducts, hasMore, columnCountOnMobile, columnCountOnDesktop}) => {
  const items = products ? products.map((product, index) => {
    return (
      <ListItem
        key={index}
        product={product}
        addCartItem={addCartItem}
        settings={settings}
        columnCountOnMobile={columnCountOnMobile}
        columnCountOnDesktop={columnCountOnDesktop}
      />
    )
  }) : null;

  return (
    <div>
      <div className="columns is-multiline is-mobile products">
        {items}
      </div>
      <LoadMore loadMoreProducts={loadMoreProducts} hasMore={hasMore} />
    </div>
  )
}

export default ProductList
