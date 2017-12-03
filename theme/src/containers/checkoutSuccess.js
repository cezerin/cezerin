import React from 'react'
import { themeSettings, text } from '../lib/settings'
import * as helper from '../lib/helper'
import MetaTags from '../components/metaTags'
import CheckoutSuccess from '../components/checkoutSuccess'
const Fragment = React.Fragment;

const CheckoutSuccessContainer = (props) => {
  const {pageDetails, order, settings, shippingMethods, checkoutFields} = props.state;
  const shippingMethod = helper.getShippingMethodFromOrder(order, shippingMethods);

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
          <div className="columns content">
            <div className="column is-8 is-offset-2">
              <div className="checkout-box">
                <CheckoutSuccess
                  order={order}
                  settings={settings}
                  pageDetails={pageDetails}
                  shippingMethod={shippingMethod}
                  checkoutFields={checkoutFields}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

    </Fragment>
  )
}

export default CheckoutSuccessContainer
