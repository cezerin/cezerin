import React from 'react'
import { NavLink } from 'react-router-dom'
import { themeSettings, text } from '../lib/settings'
import * as helper from '../lib/helper'

const GalleryItemImage = ({ category }) => {
  const imageUrl = category.image && category.image.length > 0 ? helper.getThumbnailUrl(category.image, themeSettings.category_list_thumbnail_width) : '';

  if(imageUrl && imageUrl !== ''){
    return (
      <div className="card-image">
        <figure className="image">
          <img src={imageUrl} alt={category.name} />
        </figure>
      </div>
    )
  } else {
    return null;
  }
}

const GalleryItem = ({ category }) => {
  return (
    <div className="column is-4-tablet is-12-mobile">
      <NavLink to={category.path}>
        <div className="card">
          <GalleryItemImage category={category} />
          <div className="card-content">
            <div className="content">
              <h3 className="title is-6">{category.name}</h3>
            </div>
          </div>
        </div>
      </NavLink>
    </div>
  )
}

const CategoryGallery = ({ categories }) => {
  const items = categories.filter(category => category.parent_id === null).map((category, index) => <GalleryItem key={index} category={category} />)
  return (
    <div className="columns is-multiline is-mobile">
      {items}
    </div>
  )
}

export default CategoryGallery
