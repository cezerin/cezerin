import React from 'react'
import { themeSettings, text } from '../lib/settings'

import MetaTags from '../components/metaTags'
import ProductList from '../components/productList'
import Sort from '../components/sort'
import SearchBox from '../components/searchBox'
import PriceSlider from '../components/priceSlider'

const CategoryContainer = (props) => {
  const {products, settings, productFilter, productsHasMore, productsMinPrice, productsMaxPrice, productsTotalCount} = props.state;
  const {setSearch, setSort, setPriceFromAndTo, addCartItem, loadMoreProducts} = props;
  const searchNotEmpty = productFilter.search && productFilter.search !== '';
  const searchDescription = searchNotEmpty ? `${text.resultsFor} "${productFilter.search}"` : text.search;
  const title = searchNotEmpty ? `${productFilter.search} - ${text.search}` : text.search;

  return (
    <div>
      <MetaTags
        title={title}
      />

      <section className="hero is-light">
        <div className="hero-body">
          <div className="container">
            <h1 className="title is-4">{searchDescription}</h1>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <ProductList
            products={products}
            addCartItem={addCartItem}
            settings={settings}
            loadMoreProducts={loadMoreProducts}
            hasMore={productsHasMore}
            columnCountOnMobile={2}
            columnCountOnDesktop={4}
          />
        </div>
      </section>

    </div>
  )
}

export default CategoryContainer
