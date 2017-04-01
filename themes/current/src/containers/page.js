import React from 'react'
import text from '../lib/text'
import config from '../lib/config'

import MetaTags from '../components/metaTags'

const PageContainer = (props) => {
  const {pageDetails} = props.state;

  return (
    <div>
      <MetaTags
        title={pageDetails.meta_title}
        description={pageDetails.meta_description}
        canonicalUrl={pageDetails.url}
        ogType="article"
        ogTitle={pageDetails.meta_title}
        ogDescription={pageDetails.meta_description}
      />

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

export default PageContainer
