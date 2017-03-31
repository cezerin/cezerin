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

      <section className="section" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="container">
          <div className="columns">
            <div className="column is-4">
              <OrderSummary {...props} />
            </div>
            <div className="column is-8">
              <div className="checkout-box">
                <h1 className="title is-4">{text.checkoutPageTitle}</h1>
                {checkoutForm}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CheckoutContainer
