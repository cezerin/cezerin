import React from 'react'
import {Link} from 'react-router'
import text from '../lib/text'
import config from '../lib/config'
import * as helper from '../lib/helper'

const GalleryItem = ({ category }) => {
  const imageUrl = category.image && category.image.length > 0 ? helper.getThumbnailUrl(category.image, config.category_thumbnail_width) : '';

  return (
    <div className="column is-6-tablet is-12-mobile">
      <Link to={category.path}>
        <div className="card">
          <div className="card-image">
            <figure className="image">
              <img src={imageUrl} alt={category.name} />
            </figure>
          </div>
          <div className="card-content">
            <div className="content">
              <h3 className="title is-6">{category.name}</h3>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

const Gallery = ({ categories }) => {
  const items = categories.filter(category => category.parent_id === null).map((category, index) => <GalleryItem key={index} category={category} />)
  return (
    <div className="columns is-multiline is-mobile">
      {items}
    </div>
  )
}

export default Gallery
