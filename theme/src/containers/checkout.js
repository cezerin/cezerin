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
          <div className="columns columns-checkout">
            <div className="column is-5-widescreen is-offset-1-widescreen is-6-desktop">
              <OrderSummary {...props} />
            </div>
            <div className="column is-6-widescreen is-6-desktop">
              {checkoutForm}
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  )
}

export default CheckoutContainer
