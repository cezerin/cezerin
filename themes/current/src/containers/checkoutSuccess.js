import React from 'react'
import text from '../lib/text'
import config from '../lib/config'

import MetaTags from '../components/metaTags'
import CheckoutSuccess from '../components/checkoutSuccess'

const CheckoutSuccessContainer = (props) => {
  const {pageDetails} = props.state;

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
          <CheckoutSuccess {...props} />
        </div>
      </section>
    </div>
  )
}

export default CheckoutSuccessContainer
