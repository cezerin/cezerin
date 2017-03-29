import React from 'react'
import Helmet from 'react-helmet'
import MediaQuery from 'react-responsive'
import Products from '../components/products'
import ProductsSidebar from '../components/productsSidebar'
import ProductsSort from '../components/productsSort'
import SearchBox from '../components/searchBox'
import PriceSlider from '../components/priceSlider'
import text from '../lib/text'

const CategoryContainer = (props) => {
  const {products, categoryDetails, settings, productsFilter, products_has_more, products_min_price, products_max_price, products_total_count} = props.state;

  return (
    <div>
      <Helmet title={text.search} meta={[
        {
          "name": "description",
          "content": ""
        }, {
          "property": "og:type",
          "content": "article"
        }
      ]}/>

      <section className="hero is-light">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              {text.search}
            </h1>
            <SearchBox value={productsFilter.search} onSearch={props.setSearch} />
            <div style={{ marginTop: 10 }}>
              {text.found}: <b>{products_total_count || 0}</b>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-one-quarter">
              <ProductsSort defaultSort={settings.default_product_sorting} currentSort={productsFilter.sort} setSort={props.setSort} />
              <PriceSlider
                minPrice={products_min_price}
                maxPrice={products_max_price}
                minValue={productsFilter.price_from}
                maxValue={productsFilter.price_to}
                setPriceFromAndTo={props.setPriceFromAndTo}
                settings={settings}
              />
            </div>
            <div className="column">
              <Products
                products={products}
                addCartItem={props.addCartItem}
                settings={settings}
                loadMoreProducts={props.loadMoreProducts}
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
