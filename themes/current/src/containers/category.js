import React from 'react'
import text from '../lib/text'
import config from '../lib/config'

import MetaTags from '../components/metaTags'
import ProductList from '../components/productList'
import ProductFilter from '../components/productFilter'
import Sort from '../components/sort'

const CategoryContainer = (props) => {
  const {products, categoryDetails, settings, productFilter, products_has_more} = props.state;
  const {setSort, addCartItem, loadMoreProducts} = props;

  const title = categoryDetails.meta_title && categoryDetails.meta_title.length > 0 ? categoryDetails.meta_title : categoryDetails.name;

  return (
    <div>
      <MetaTags
        title={title}
        description={categoryDetails.meta_description}
        canonicalUrl={categoryDetails.url}
        imageUrl={categoryDetails.image}
        ogType="product.group"
        ogTitle={categoryDetails.name}
        ogDescription={categoryDetails.meta_description}
      />

      <section className="hero is-light">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              {categoryDetails.name}
            </h1>
            <h2 className="subtitle">
              {categoryDetails.description}
            </h2>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="columns">
            <ProductFilter {...props} />
            <div className="column">
              <div className="columns is-hidden-mobile">
                <div className="column"></div>
                <div className="column is-4">
                  <Sort defaultSort={settings.default_product_sorting} currentSort={productFilter.sort} setSort={setSort} />
                </div>
              </div>
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
