import React from 'react'
import { NavLink } from 'react-router-dom'
import { themeSettings, text } from '../lib/settings'
import * as helper from '../lib/helper'

const ItemPrice = ({ product, settings }) => {
  let priceStyle = {};
  if(themeSettings.list_price_size && themeSettings.list_price_size > 0){
    priceStyle.fontSize = themeSettings.list_price_size + 'px';
  }
  if(themeSettings.list_price_color && themeSettings.list_price_color.length > 0){
    priceStyle.color = themeSettings.list_price_color;
  }

  if(product.on_sale) {
    return (
      <div className="product-price">
        <span className="product-new-price">{helper.formatCurrency(product.price, settings)}</span>
        <del className="product-old-price">{helper.formatCurrency(product.regular_price, settings)}</del>
      </div>
    )
  } else {
    return (
      <div className="product-price" style={priceStyle}>
        {helper.formatCurrency(product.price, settings)}
      </div>
    )
  }
}

const ItemImage = ({ images, alt }) => {
  if(images && images.length > 0) {
    const imageUrl = helper.getThumbnailUrl(images[0].url, themeSettings.listThumbnailWidth);

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
  const maxHeight = themeSettings.list_image_max_height && themeSettings.list_image_max_height > 0 ? themeSettings.list_image_max_height : 280;

  return (
    <div className={`column is-${columnSizeOnMobile}-mobile is-${columnSizeOnDesktop}-tablet`}>
      <NavLink to={product.path}>
        <figure className="image" style={{ maxHeight: maxHeight }}>
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

const LoadMore = ({ loadMoreProducts, hasMore, loading }) => {
  let buttonStyle = {};
  if(themeSettings.button_loadmore_bg && themeSettings.button_loadmore_bg.length > 0){
    buttonStyle.backgroundColor = themeSettings.button_loadmore_bg;
  }
  if(themeSettings.button_loadmore_color && themeSettings.button_loadmore_color.length > 0){
    buttonStyle.color = themeSettings.button_loadmore_color;
  }

  let loadMoreText = themeSettings.button_loadmore_text && themeSettings.button_loadmore_text.length > 0 ? themeSettings.button_loadmore_text : text.loadMore;

  return (
    <div className="load-more">
      {hasMore &&
        <button onClick={loadMoreProducts} className="button is-fullwidth is-dark" style={buttonStyle} disabled={loading}>{loadMoreText}</button>
      }
    </div>
  )
}

const ProductList = ({products, addCartItem, settings, loadMoreProducts, hasMore, columnCountOnMobile, columnCountOnDesktop, loadingProducts, loadingMoreProducts}) => {
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
      <div className={'columns is-multiline is-mobile products' + (loadingProducts ? ' loading': '')}>
        {items}
      </div>
      <LoadMore loadMoreProducts={loadMoreProducts} hasMore={hasMore} loading={loadingMoreProducts} />
    </div>
  )
}

export default ProductList
