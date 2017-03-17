import React from 'react'
import Helmet from 'react-helmet'

const CheckoutSuccessContainer = (props) => {
  const {page, order} = props.state;

  if (order && order.items && order.items.length > 0) {
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
        <div>
          <h1>Thank you, {order.shipping_address.full_name}!</h1>
          <p>{order.email}</p>
        </div>
      </div>
    )
  } else {
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
        <p>No data</p>
      </div>
    )
  }
}

export default CheckoutSuccessContainer
