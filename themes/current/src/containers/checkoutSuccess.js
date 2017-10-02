import React from 'react'
import { themeSettings, text } from '../lib/settings'

import MetaTags from '../components/metaTags'
import CheckoutSuccess from '../components/checkoutSuccess'

const CheckoutSuccessContainer = (props) => {
  const {pageDetails, order, cart, settings} = props.state;

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
          <div className="columns content">
            <div className="column is-8 is-offset-2">
              <div className="checkout-box">
                <CheckoutSuccess order={order} settings={settings} pageDetails={pageDetails} />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default CheckoutSuccessContainer
