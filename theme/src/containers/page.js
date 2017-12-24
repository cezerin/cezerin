import React from 'react'
import { themeSettings, text } from '../lib/settings'
import MetaTags from '../components/metaTags'
import PageList from '../components/pageList'
const Fragment = React.Fragment;

const PageContainer = (props) => {
  const {pageDetails, currentPage} = props.state;
  const pageListTag = themeSettings.page_list_tag;
  const pageListTagDefined = pageListTag && pageListTag.length > 0;
  const pageListPath = pageListTagDefined ? ('/' + pageListTag) : null;
  const showPageList = pageListTagDefined && (pageDetails.path === pageListPath);

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
            <div className="page-content" dangerouslySetInnerHTML={{
              __html: pageDetails.content
            }}/>
            {showPageList &&
              <PageList tags={pageListTag} sort="-date_created" />
            }
          </div>
        </div>
      </section>

    </Fragment>
  )
}

export default PageContainer
