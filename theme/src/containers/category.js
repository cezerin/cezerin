import React from 'react'
import { themeSettings, text } from '../lib/settings'
import MetaTags from '../components/metaTags'
import ProductList from '../components/productList'
import ProductFilter from '../components/productFilter'
import Sort from '../components/sort'
import CategoryBreadcrumbs from '../components/categoryBreadcrumbs'
import * as helper from '../lib/helper'
const Fragment = React.Fragment;

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

const CategoryHero = ({ categoryDetails, categories }) => (
  <section className="hero is-light">
    <div className="hero-body">
      <div className="container">
        {themeSettings.show_category_breadcrumbs &&
          <CategoryBreadcrumbs currentCategory={categoryDetails} categories={categories} />
        }
        <h1 className="category-title">
          {categoryDetails.name}
        </h1>
        <div
          className="category-description is-hidden-mobile content"
          dangerouslySetInnerHTML={{ __html: categoryDetails.description }}
        />
      </div>
    </div>
  </section>
)

const CategoryContainer = (props) => {
  const {products, categoryDetails, settings, productFilter, productsHasMore, categories, loadingProducts, loadingMoreProducts} = props.state;
  const {setSort, addCartItem, loadMoreProducts, getJSONLD} = props;

  const filterAttributesSummary = getFilterAttributesSummary(productFilter);
  const filterPriceSummary = getFilterPriceSummary(productFilter, settings);

  const pageTitle = categoryDetails.meta_title && categoryDetails.meta_title.length > 0 ? categoryDetails.meta_title : categoryDetails.name;
  const title = `${pageTitle}${filterAttributesSummary}${filterPriceSummary}`;

  const jsonld = getJSONLD(props.state);

  const showFilter = themeSettings.show_product_filter;

  return (
    <Fragment>
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

      <CategoryHero categoryDetails={categoryDetails} categories={categories} />

      <section className="section section-category">
        <div className="container">
          <div className="columns">

            {showFilter === true &&
              <div className="column is-one-quarter left-sidebar">
                <ProductFilter {...props} />
              </div>
            }

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
                loadingProducts={loadingProducts}
                loadingMoreProducts={loadingMoreProducts}
              />
            </div>


          </div>
        </div>
      </section>

    </Fragment>
  )
}

export default CategoryContainer
