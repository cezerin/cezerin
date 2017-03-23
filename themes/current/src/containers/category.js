import React from 'react'
import Helmet from 'react-helmet'
import Breadcrumbs from '../components/breadcrumbs'
import Products from '../components/products'
import ProductsSidebar from '../components/productsSidebar'
import Waypoint from 'react-waypoint'

const CategoryContainer = (props) => {
  const {products, currentCategory, settings} = props.state;

  return (
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
            <ProductsSidebar {...props} />
            <div className="column">
              <Products products={products} addCartItem={props.addCartItem} settings={settings}/>
              <Waypoint onEnter={props.loadMoreProducts}/>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default CategoryContainer
