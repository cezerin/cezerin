import React from 'react'
import Helmet from 'react-helmet'

const NotFoundContainer = (props) => (
  <div>
    <Helmet title="Page not found"/>
    <section className="section">
      <div className="container">
        <div className="content">
          <h1>Page not found</h1>
          The page you requested does not exist. Click here to continue shopping.
        </div>
      </div>
    </section>
  </div>
)

export default NotFoundContainer
