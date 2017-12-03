import React from 'react'
import { themeSettings, text } from '../../lib/settings'
import Item from './item'
import LoadMore from './loadMore'
const Fragment = React.Fragment;

const ProductList = ({
  products,
  addCartItem,
  settings,
  loadMoreProducts,
  hasMore,
  loadingProducts,
  loadingMoreProducts,
  isCentered,
  className,
  columnCountOnMobile,
  columnCountOnTablet,
  columnCountOnDesktop,
  columnCountOnWidescreen,
  columnCountOnFullhd
}) => {
  if(!className || className === ''){
    className = 'columns is-multiline is-mobile products';
  }

  const items = products ? products.map((product, index) => {
    return (
      <Item
        key={index}
        product={product}
        addCartItem={addCartItem}
        settings={settings}
        columnCountOnMobile={columnCountOnMobile}
        columnCountOnTablet={columnCountOnTablet}
        columnCountOnDesktop={columnCountOnDesktop}
        columnCountOnWidescreen={columnCountOnWidescreen}
        columnCountOnFullhd={columnCountOnFullhd}
      />
    )
  }) : null;

  return (
    <Fragment>
      <div className={className + (loadingProducts ? ' loading': '') + (isCentered ? ' is-centered' : '')}>
        {items}
      </div>
      <div className="load-more">
        <LoadMore loadMoreProducts={loadMoreProducts} hasMore={hasMore} loading={loadingMoreProducts} />
      </div>
    </Fragment>
  )
}

export default ProductList
