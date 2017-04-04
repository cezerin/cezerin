import React from 'react'
import CategoryEdit from 'modules/product-categories/edit';
import Categories from 'modules/product-categories/list';

export default () => (
  <div className="row row--no-gutter col-full-height">
    <div className="col-xs-3 col--no-gutter scroll right-border">
      <Categories showAll={false} showTrash={false} showAdd={true} />
    </div>
    <div className="col-xs-9 col--no-gutter scroll">
      <CategoryEdit />
    </div>
  </div>
)
