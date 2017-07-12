import React from 'react'
import text from '../lib/text'
import config from '../lib/config'

import MetaTags from '../components/metaTags'
import CategoryGallery from '../components/categoryGallery'
import CustomProductList from '../components/customProductList'

const IndexContainer = (props) => {
  const {pageDetails, categories, settings} = props.state;
  const {addCartItem} = props;

  return (
    <div>
      <MetaTags
        title={pageDetails.meta_title}
        description={pageDetails.meta_description}
        canonicalUrl={pageDetails.url}
        ogTitle={pageDetails.meta_title}
        ogDescription={pageDetails.meta_description}
      />

      <section className="section">
        <div className="container">
          <div className="content">
            <div dangerouslySetInnerHTML={{
              __html: pageDetails.content
            }}/>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="title is-3">Categories</div>
          <CategoryGallery categories={categories} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="title is-3">New Arrivals</div>
          <CustomProductList settings={settings} addCartItem={addCartItem} />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="notification">
            <div className="columns">

              <div className="column is-4 has-text-centered">
                <img src="/assets/images/delivery-cart.svg" alt="" style={{ width: 64 }} />
                <div className="title is-6">
                  Free shipping on orders over USD $89
                </div>
              </div>

              <div className="column is-4 has-text-centered">
                <img src="/assets/images/credit-card.svg" alt="" style={{ width: 64 }} />
                <div className="title is-6">
                  We accept credit cards, PayPal, and bank wires
                </div>
              </div>

              <div className="column is-4 has-text-centered">
                <img src="/assets/images/open.svg" alt="" style={{ width: 64 }} />
                <div className="title is-6">
                  Open 24/7
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default IndexContainer
