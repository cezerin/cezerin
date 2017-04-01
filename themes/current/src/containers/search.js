import React from 'react'
import text from '../lib/text'
import config from '../lib/config'

import MetaTags from '../components/metaTags'
import ProductList from '../components/productList'
import Sort from '../components/sort'
import SearchBox from '../components/searchBox'
import PriceSlider from '../components/priceSlider'

const CategoryContainer = (props) => {
  const {products, settings, productFilter, products_has_more, products_min_price, products_max_price, products_total_count} = props.state;
  const {setSearch, setSort, setPriceFromAndTo, addCartItem, loadMoreProducts} = props;
  const title = productFilter.search && productFilter.search !== '' ? `${products_total_count || 0} ${text.resultsFor} "${productFilter.search}"` : text.search;

  return (
    <div>
      <MetaTags
        title={text.search}
      />

      <section className="hero is-dark">
        <div className="hero-body">
          <div className="container">
            <h1 className="title is-4">{title}</h1>
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
                minPrice={products_min_price}
                maxPrice={products_max_price}
                minValue={productFilter.price_from}
                maxValue={productFilter.price_to}
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
                hasMore={products_has_more}
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default CategoryContainer
