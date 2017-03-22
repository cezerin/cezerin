import React from 'react'
import {Link} from 'react-router'
import ImageGallery from 'react-image-gallery'
import config from '../lib/config'
import * as helper from '../lib/helper'

const ProductOptions = ({options, variants}) => {
  return null;
}

const RelatedProducts = ({ids}) => {
  return null;
}

const ProductGallery = ({images}) => {
  if (images.length > 0) {
    const imagesArray = images.map(image => (
      {
        original: helper.getThumbnailUrl(image.url, config.big_thumbnail_width),
        thumbnail: helper.getThumbnailUrl(image.url, config.preview_thumbnail_width),
        originalAlt: image.alt,
        thumbnailAlt: image.alt
      }
    ))

    const showThumbnails = images.length > 1;

    return (
      <ImageGallery
        items={imagesArray}
        showThumbnails={showThumbnails}
        slideInterval={2000}
        lazyLoad={true}
        showNav={false}
        showPlayButton={false}
        showFullscreenButton={false}
        thumbnailPosition="bottom"
      />
    )

  } else {
    return null;
  }
}

// options
// attributes

//       <ProductGallery images={product.images}/>
// RELATED PRODUCTS
//       <ProductOptions options={product.options} variant={product.variant} />

const ProductDetail = ({product, addCartItem, settings}) => {
  const imageUrl = (product.images && product.images.length > 0)
    ? product.images[0].url
    : '/assets/images/placeholder.svg';

  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-half">
            <ProductGallery images={product.images} />
          </div>
          <div className="column is-half">
            <div className="content">
              <h1>{product.name}</h1>
              <p>{product.stock_status}</p>
              <p>{helper.formatCurrency(product.price, settings)}</p>
              <button className="button" onClick={() => addCartItem({product_id: product.id, variant_id: null, quantity: 1})}>Add to cart</button>
            </div>
          </div>
        </div>
        <div className="content">
          <div dangerouslySetInnerHTML={{
            __html: product.description
          }}/>
        </div>
      </div>
    </section>
  )
}

export default ProductDetail
