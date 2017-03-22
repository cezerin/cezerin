import React from 'react'
import Helmet from 'react-helmet'
import CheckoutSuccess from '../components/checkoutSuccess'

const CheckoutSuccessContainer = (props) => {
  const {pageData} = props.state;

  return (
    <div>
      <Helmet title={pageData.meta_title} meta={[
        {
          "name": "description",
          "content": pageData.meta_description
        }, {
          "property": "og:type",
          "content": "article"
        }
      ]} link={[{
          "rel": "canonical",
          "href": pageData.url
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
