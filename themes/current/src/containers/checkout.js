import React from 'react'
import text from '../lib/text'
import config from '../lib/config'

import MetaTags from '../components/metaTags'
import OrderSummary from '../components/orderSummary'

const CheckoutContainer = (props) => {
  const {pageDetails} = props.state;
  const {checkoutForm} = props;

  return (
    <div>
      <MetaTags
        title={pageDetails.meta_title}
        description={pageDetails.meta_description}
        canonicalUrl={pageDetails.url}
        ogTitle={pageDetails.meta_title}
        ogDescription={pageDetails.meta_description}
      />

      <section className="section section-checkout">
        <div className="container">
          <div className="columns">
            <div className="column is-4 is-offset-1">
              <OrderSummary {...props} />
            </div>
            <div className="column is-6">
              {checkoutForm}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CheckoutContainer
