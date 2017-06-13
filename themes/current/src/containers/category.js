import React from 'react'
import text from '../lib/text'
import config from '../lib/config'

import MetaTags from '../components/metaTags'
import ProductList from '../components/productList'
import ProductFilter from '../components/productFilter'
import Sort from '../components/sort'
import * as helper from '../lib/helper'

const getFilterAttributesSummary = (productFilter) => {
  let attributesSummary = '';
  if(productFilter.attributes) {
    for(const attributeKey in productFilter.attributes) {
      const attributeName = attributeKey.replace('attributes.', '');
      const attributeValue = productFilter.attributes[attributeKey];
      const attributeValueFormatted = Array.isArray(attributeValue) ? attributeValue.join(', ') : attributeValue;
      attributesSummary += `. ${attributeName}: ${attributeValueFormatted}`;
    }
  }
  return attributesSummary;
}

const getFilterPriceSummary = (productFilter, settings) => {
  let priceSummary = '';
  if(productFilter.priceFrom > 0 && productFilter.priceTo > 0){
    const priceFrom = helper.formatCurrency(productFilter.priceFrom, settings);
    const priceTo = helper.formatCurrency(productFilter.priceTo, settings);
    priceSummary = `. ${text.price}: ${priceFrom} - ${priceTo}`;
  }
  return priceSummary;
}

const CategoryContainer = (props) => {
  const {products, categoryDetails, settings, productFilter, productsHasMore} = props.state;
  const {setSort, addCartItem, loadMoreProducts, getJSONLD} = props;

  const filterAttributesSummary = getFilterAttributesSummary(productFilter);
  const filterPriceSummary = getFilterPriceSummary(productFilter, settings);

  const pageTitle = categoryDetails.meta_title && categoryDetails.meta_title.length > 0 ? categoryDetails.meta_title : categoryDetails.name;
  const title = `${pageTitle}${filterAttributesSummary}${filterPriceSummary}`;

  const jsonld = getJSONLD(props.state);

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
        jsonld={jsonld}
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
                <div className="column is-5">
                  <Sort defaultSort={settings.default_product_sorting} currentSort={productFilter.sort} setSort={setSort} />
                </div>
              </div>
              <ProductList
                products={products}
                addCartItem={addCartItem}
                settings={settings}
                loadMoreProducts={loadMoreProducts}
                hasMore={productsHasMore}
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default CategoryContainer
