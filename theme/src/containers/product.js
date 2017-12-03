import React from 'react'
import { themeSettings, text } from '../lib/settings'
import MetaTags from '../components/metaTags'
import ProductDetails from '../components/productDetails'
const Fragment = React.Fragment;

const ProductContainer = (props) => {
  const {productDetails, settings, categories} = props.state;
  const {addCartItem, getJSONLD} = props;

  if (productDetails) {
    const images = productDetails.images;
    let imageUrl = images && images.length > 0 ? images[0].url : null;
    const title = productDetails.meta_title && productDetails.meta_title.length > 0 ? productDetails.meta_title : productDetails.name;
    const jsonld = getJSONLD(props.state);

    return (
      <Fragment>
        <MetaTags
          title={title}
          description={productDetails.meta_description}
          canonicalUrl={productDetails.url}
          imageUrl={imageUrl}
          ogType="product"
          ogTitle={productDetails.name}
          ogDescription={productDetails.meta_description}
          jsonld={jsonld}
        />

        <ProductDetails
          settings={settings}
          product={productDetails}
          addCartItem={addCartItem}
          categories={categories}
        />
      </Fragment>
    )
  } else {
    return null
  }
}

export default ProductContainer
