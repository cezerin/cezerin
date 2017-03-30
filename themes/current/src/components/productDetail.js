import React from 'react'
import {Link} from 'react-router'
import ImageGallery from 'react-image-gallery'
import config from '../lib/config'
import text from '../lib/text'
import * as helper from '../lib/helper'

const ProductOptions = ({ product }) => {
  return (
    <p>
      <span className="select is-fullwidth">
        <select>
          <option>Not implemented</option>
        </select>
      </span>
    </p>
  );
}

const RelatedProducts = ({ ids }) => {
  return (
    <div className="container">
      <div className="title is-4">{text.relatedProducts}</div>
      <div>Not implemented</div>
    </div>
  );
}

const ProductAttributes = ({ attributes }) => {
  const items = attributes.map((attribute, index) => <div key={index}>{attribute.name}: {attribute.value}</div>);
  return (
    <div className="product-attributes">
      {items}
    </div>
  )
}

const ProductPrice = ({ product, settings }) => {
  if(product.on_sale) {
    return (
      <div className="title is-5">
        <del className="product-old-price">{helper.formatCurrency(product.regular_price, settings)}</del>
        <span className="product-new-price">{helper.formatCurrency(product.price, settings)}</span>
      </div>
    )
  } else {
    return (
      <div className="subtitle is-5">
        {helper.formatCurrency(product.price, settings)}
      </div>
    )
  }
}

const AddToCartButton = ({ product, addCartItem }) => {
  if(product.stock_status === 'available') {
    return <button className="button is-dark is-fullwidth" onClick={() => addCartItem({product_id: product.id, variant_id: null, quantity: 1})}>{text.addToCart}</button>
  }
  else if(product.stock_status === 'out_of_stock') {
    return <button className="button is-dark is-fullwidth" disabled>{text.outOfStock}</button>
  }
  else if(product.stock_status === 'discontinued') {
    return <button className="button is-dark is-fullwidth" disabled>{text.discontinued}</button>
  } else {
    return null;
  }
}

const ProductDescription = ({ description }) => {
  return (
    <div dangerouslySetInnerHTML={{__html: description}}/>
  )
}

const ProductGallery = ({ images }) => {
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
    return <div className="large-image-placeholder"></div>;
  }
}

const ProductDetail = ({product, addCartItem, settings}) => {
  return (
    <section className="section">
      <div className="container">
        <div className="columns">
          <div className="column is-6">
            <ProductGallery images={product.images} />
          </div>
          <div className="column is-5 is-offset-1">
            <div className="content">

              <h1 className="title is-4">{product.name}</h1>

              <ProductPrice product={product} settings={settings} />

              <ProductOptions product={product} />

              <div className="columns">
                <div className="column is-6">
                  <AddToCartButton product={product} addCartItem={addCartItem} />
                </div>
              </div>

              <ProductAttributes attributes={product.attributes} />

            </div>
          </div>
        </div>
        <div className="content">
          <ProductDescription description={product.description} />
        </div>
      </div>
      <RelatedProducts ids={product.related_product_ids} />
    </section>
  )
}

export default ProductDetail
