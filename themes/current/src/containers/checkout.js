import React from 'react'
import Helmet from 'react-helmet'

const CheckoutContainer = (props) => {
  const {page} = props.state;

  return (
    <div>
      <Helmet title={page.meta_title} meta={[
        {
          "name": "description",
          "content": page.meta_description
        }, {
          "property": "og:type",
          "content": "article"
        }
      ]} link={[{
          "rel": "canonical",
          "href": page.url
        }
      ]}/>
      <h1>Checkout</h1>
      {props.checkoutForm}
    </div>
  )
}

export default CheckoutContainer
