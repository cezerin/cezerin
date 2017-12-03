import React from 'react'
import { themeSettings, text } from '../lib/settings'
import MetaTags from '../components/metaTags'
import CategoryGallery from '../components/categoryGallery'
import CustomProducts from '../components/products/custom'
import HomeSlider from '../components/homeSlider'
const Fragment = React.Fragment;

const IndexContainer = (props) => {
  const {pageDetails, categories, settings} = props.state;
  const {addCartItem} = props;

  return (
    <Fragment>
      <MetaTags
        title={pageDetails.meta_title}
        description={pageDetails.meta_description}
        canonicalUrl={pageDetails.url}
        ogTitle={pageDetails.meta_title}
        ogDescription={pageDetails.meta_description}
      />

      <HomeSlider images={themeSettings.home_slider} />

      {pageDetails.content && pageDetails.content.length > 10 &&
        <section className="section">
          <div className="container">
            <div className="content">
              <div dangerouslySetInnerHTML={{
                __html: pageDetails.content
              }}/>
            </div>
          </div>
        </section>
      }

      <section className="section">
        <div className="container">
          <div className="title is-4 has-text-centered">{themeSettings.home_products_title}</div>
          <CustomProducts
            sku={themeSettings.home_products_sku}
            sort={themeSettings.home_products_sort}
            limit={themeSettings.home_products_limit}
            settings={settings}
            addCartItem={addCartItem}
          />
        </div>
      </section>

    </Fragment>
  )
}

export default IndexContainer
