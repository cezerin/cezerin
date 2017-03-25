import React from 'react'
import {Link} from 'react-router'
import ImageGallery from 'react-image-gallery'
import config from '../lib/config'
import text from '../lib/text'
import * as helper from '../lib/helper'

const TreeElement = ({ categories, currentCategory, activeCategory, onClick }) => {
  const childs = categories.filter(category => category.parent_id === currentCategory.id).map((category, index) => <TreeElement key={index} categories={categories} currentCategory={category} activeCategory={activeCategory} />)
  const currentCategoryIsActive = activeCategory && activeCategory.id === currentCategory.id;
  const parentCategoryIsActive = activeCategory && activeCategory.parent_id === currentCategory.id;

  return (
    <li className={currentCategoryIsActive || parentCategoryIsActive ? 'active' : ''}>
      <Link to={currentCategory.path} activeClassName="active" onClick={onClick}>{currentCategory.name}</Link>
      {childs && childs.length > 0 &&
        <ul>
          {childs}
        </ul>
      }
    </li>
  )
}

const Tree = ({ categories, activeCategory, onClick }) => {
  if(categories) {
    const elements = categories.filter(category => category.parent_id === null).map((category, index) => <TreeElement key={index} categories={categories} currentCategory={category} activeCategory={activeCategory} onClick={onClick} />)
    return (
      <div className="categories-tree">
        <ul>
          {elements}
        </ul>
      </div>
    )
  } else {
    return null
  }
}

export default Tree
