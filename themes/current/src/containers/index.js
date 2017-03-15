import React from 'react';
import Helmet from 'react-helmet';

export default (
  {
    location,
    currentPage,
    currentCategory,
    currentProduct,
    categories,
    products,
    productsFilter,
    cart,
    page
  }
) => (
  <div>
    <Helmet
      title={page.meta_title}
      meta={[
        {
          name: 'description',
          content: page.meta_description
        },
        {
          property: 'og:type',
          content: 'article'
        }
      ]}
      link={[
        {
          rel: 'canonical',
          href: page.url
        }
      ]}
    />
    <div>
      slider
    </div>
    <div
      dangerouslySetInnerHTML={{
        __html: page.content
      }}
    />
  </div>
);
