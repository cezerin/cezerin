import React from 'react'
import Helmet from 'react-helmet'

const IndexContainer = (props) => {
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

      <section className="hero is-primary is-medium">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              Medium title
            </h1>
            <h2 className="subtitle">
              Medium subtitle
            </h2>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="content">
            <div dangerouslySetInnerHTML={{
              __html: pageData.content
            }}/>
          </div>
        </div>
      </section>
    </div>
  )
}
export default IndexContainer
