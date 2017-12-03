import React from 'react'
import { themeSettings, text } from '../lib/settings'
import MetaTags from '../components/metaTags'
import OrderSummary from '../components/orderSummary'
const Fragment = React.Fragment;

const CheckoutContainer = (props) => {
  const {pageDetails} = props.state;
  const {checkoutForm} = props;

  return (
    <Fragment>
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
    </Fragment>
  )
}

export default CheckoutContainer
