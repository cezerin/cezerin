import React from 'react'
import { themeSettings, text } from '../../lib/settings'
import * as helper from '../../lib/helper'
import LazyLoad from 'react-lazyload'

const ItemImage = ({ images, alt, title, height }) => {
  if(images && images.length > 0) {
    const imageUrl = helper.getThumbnailUrl(images[0].url, themeSettings.listThumbnailWidth);

    return (
      <LazyLoad height={height}>
        <img src={imageUrl} alt={alt} title={title} />
      </LazyLoad>
    )
  } else {
    return (
      <div style={{ height: height }} className="small-image-placeholder"></div>
    )
  }
}

export default ItemImage
