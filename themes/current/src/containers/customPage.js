import React from 'react'
import Helmet from 'react-helmet'

const CustomPageContainer = (props) => {
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
          <div className="content">
            <div dangerouslySetInnerHTML={{
              __html: pageDetails.content
            }}/>
          </div>
        </div>
      </section>
    </div>
  )

}

export default CustomPageContainer
