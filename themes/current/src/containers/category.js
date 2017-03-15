import React from 'react'
import Helmet from 'react-helmet'
import Breadcrumbs from '../components/breadcrumbs'
import Products from '../components/products'

export default({
  location,
  currentPage,
  currentCategory,
  currentProduct,
  categories,
  products,
  productsFilter,
  cart,
  addCartItem,
  deleteCartItem
}) => (
  <div>
    <Helmet title={currentCategory.meta_title !== ''
      ? currentCategory.meta_title
      : currentCategory.name} meta={[
      {
        "name": "description",
        "content": currentCategory.meta_description
      }, {
        "property": "og:type",
        "content": "article"
      }
    ]} link={[{
        "rel": "canonical",
        "href": currentCategory.url
      }
    ]}/>
    <section className="hero is-light">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">
            {currentCategory.name}
          </h1>
          <h2 className="subtitle">
            {currentCategory.description}
          </h2>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-one-quarter is-hidden-mobile">
            sidebar<br />CATEGORIES<br />filter
          </div>
          <div className="column">
            <Products products={products} addCartItem={addCartItem}/>
          </div>
        </div>
      </div>
    </section>

  </div>
)
