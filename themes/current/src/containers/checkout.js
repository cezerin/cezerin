import React from 'react'
import Helmet from 'react-helmet'
import text from '../lib/text'
import OrderSummary from '../components/orderSummary'

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
      <section className="section" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="container">
          <div className="columns">
            <div className="column is-4">
              <div className="box">
                <div className="title is-4">{text.orderSummary}</div>
                <OrderSummary {...props} />
              </div>
            </div>
            <div className="column is-offset-1">
              <div className="box">
                <h1 className="title is-4">{text.checkoutPageTitle}</h1>
                {props.checkoutForm}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CheckoutContainer
