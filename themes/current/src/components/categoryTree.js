import React from 'react'
import {Link} from 'react-router'
import text from '../lib/text'
import config from '../lib/config'
import * as helper from '../lib/helper'

const TreeItem = ({ categories, categoryDetails, activeCategory, onClick }) => {
  const childs = categories
    .filter(category => category.parent_id === categoryDetails.id)
    .map((category, index) =>
      <TreeItem key={index} categories={categories} categoryDetails={category} activeCategory={activeCategory} />
    );

  const parentIds = helper.getParentIds(categories, activeCategory.id);
  const isActive = parentIds.includes(categoryDetails.id) || activeCategory.id === categoryDetails.id;
  const hasChild = childs && childs.length > 0;

  let classNames = isActive ? 'active' : '';
  if(hasChild){
    classNames += classNames === '' ? 'has-child' : ' has-child';
  }

  return (
    <li className={classNames}>
      <Link to={categoryDetails.path} activeClassName="active" onClick={onClick}>{categoryDetails.name}</Link>
      {hasChild &&
        <ul>
          {childs}
        </ul>
      }
    </li>
  )
}

const CategoryTree = ({ categories, activeCategory, onClick }) => {
  if(categories) {
    const elements = categories
      .filter(category => category.parent_id === null)
      .map((category, index) =>
        <TreeItem key={index} categories={categories} categoryDetails={category} activeCategory={activeCategory} onClick={onClick} />
      );

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

export default CategoryTree
