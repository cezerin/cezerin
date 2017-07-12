import React from 'react'
import text from '../lib/text'
import config from '../lib/config'

import MetaTags from '../components/metaTags'
import ProductList from '../components/productList'
import Sort from '../components/sort'
import SearchBox from '../components/searchBox'
import PriceSlider from '../components/priceSlider'

const CategoryContainer = (props) => {
  const {products, settings, productFilter, productsHasMore, productsMinPrice, productsMaxPrice, productsTotalCount} = props.state;
  const {setSearch, setSort, setPriceFromAndTo, addCartItem, loadMoreProducts} = props;
  const searchNotEmpty = productFilter.search && productFilter.search !== '';
  const searchDescription = searchNotEmpty ? `${productsTotalCount || 0} ${text.resultsFor} "${productFilter.search}"` : text.search;
  const title = searchNotEmpty ? `${productFilter.search} - ${text.search}` : text.search;

  return (
    <div>
      <MetaTags
        title={title}
      />

      <section className="hero is-dark">
        <div className="hero-body">
          <div className="container">
            <h1 className="title is-4">{searchDescription}</h1>
            <SearchBox value={productFilter.search} onSearch={setSearch} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-one-quarter">
              <Sort defaultSort={settings.default_product_sorting} currentSort={productFilter.sort} setSort={setSort} />
              <PriceSlider
                minPrice={productsMinPrice}
                maxPrice={productsMaxPrice}
                minValue={productFilter.priceFrom}
                maxValue={productFilter.priceTo}
                setPriceFromAndTo={setPriceFromAndTo}
                settings={settings}
              />
            </div>
            <div className="column">
              <ProductList
                products={products}
                addCartItem={addCartItem}
                settings={settings}
                loadMoreProducts={loadMoreProducts}
                hasMore={productsHasMore}
                columnCountOnMobile={2}
                columnCountOnDesktop={3}
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default CategoryContainer
