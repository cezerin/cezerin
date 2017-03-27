import React from 'react'
import Helmet from 'react-helmet'
import text from '../lib/text'

const NotFoundContainer = (props) => (
  <div>
    <Helmet title={text.title404}/>
    <section className="section">
      <div className="container">
        <div className="content">
          <h1>{text.title404}</h1>
          {text.text404}
        </div>
      </div>
    </section>
  </div>
)

export default NotFoundContainer
