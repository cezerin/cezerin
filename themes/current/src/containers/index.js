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
      <div>
        slider
      </div>
      <div dangerouslySetInnerHTML={{
        __html: pageData.content
      }}/>
    </div>
  )
}
export default IndexContainer
