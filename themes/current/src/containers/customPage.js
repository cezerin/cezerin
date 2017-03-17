import React from 'react'
import Helmet from 'react-helmet'

const CustomPageContainer = (props) => {
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
      <section className="section">
        <div className="container">
          <div className="content">
            <div dangerouslySetInnerHTML={{
              __html: page.content
            }}/>
          </div>
        </div>
      </section>
    </div>
  )

}

export default CustomPageContainer
