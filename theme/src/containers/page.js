import React from 'react'
import { themeSettings, text } from '../lib/settings'
import MetaTags from '../components/metaTags'
const Fragment = React.Fragment;

const PageContainer = (props) => {
  const {pageDetails} = props.state;

  return (
    <Fragment>
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

    </Fragment>
  )
}

export default PageContainer
