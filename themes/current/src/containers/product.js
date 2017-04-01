import React from 'react'
import text from '../lib/text'
import config from '../lib/config'

import MetaTags from '../components/metaTags'
import ProductDetails from '../components/productDetails'

const ProductContainer = (props) => {
  const {productDetails, settings} = props.state;
  const {addCartItem} = props;

  if (productDetails) {
    const images = productDetails.images;
    let imageUrl = images && images.length > 0 ? images[0].url : null;
    const title = productDetails.meta_title && productDetails.meta_title.length > 0 ? productDetails.meta_title : productDetails.name;

    return (
      <div>
        <MetaTags
          title={title}
          description={productDetails.meta_description}
          canonicalUrl={productDetails.url}
          imageUrl={imageUrl}
          ogType="product"
          ogTitle={productDetails.name}
          ogDescription={productDetails.meta_description}
        />

        <ProductDetails settings={settings} product={productDetails} addCartItem={addCartItem}/>
      </div>
    )
  } else {
    return null
  }
}

export default ProductContainer
