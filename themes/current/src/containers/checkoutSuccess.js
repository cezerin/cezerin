import React from 'react'
import Helmet from 'react-helmet'
import CheckoutSuccess from '../components/checkoutSuccess'

const CheckoutSuccessContainer = (props) => {
  const {pageDetails} = props.state;

  return (
    <div>
      <Helmet title={pageDetails.meta_title} meta={[
        {
          "name": "description",
          "content": pageDetails.meta_description
        }, {
          "property": "og:type",
          "content": "article"
        }
      ]} link={[{
          "rel": "canonical",
          "href": pageDetails.url
        }
      ]}/>
      <section className="section">
        <div className="container">
          <CheckoutSuccess {...props} />
        </div>
      </section>
    </div>
  )
}

export default CheckoutSuccessContainer
