import React from 'react'
import {Link} from 'react-router'
import text from '../lib/text'
import config from '../lib/config'
import * as helper from '../lib/helper'

const TreeElement = ({ categories, categoryDetails, activeCategory, onClick }) => {
  const childs = categories.filter(category => category.parent_id === categoryDetails.id).map((category, index) => <TreeElement key={index} categories={categories} categoryDetails={category} activeCategory={activeCategory} />)
  const currentCategoryIsActive = activeCategory && activeCategory.id === categoryDetails.id;
  const parentCategoryIsActive = activeCategory && activeCategory.parent_id === categoryDetails.id;

  return (
    <li className={currentCategoryIsActive || parentCategoryIsActive ? 'active' : ''}>
      <Link to={categoryDetails.path} activeClassName="active" onClick={onClick}>{categoryDetails.name}</Link>
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
    const elements = categories.filter(category => category.parent_id === null).map((category, index) => <TreeElement key={index} categories={categories} categoryDetails={category} activeCategory={activeCategory} onClick={onClick} />)
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
