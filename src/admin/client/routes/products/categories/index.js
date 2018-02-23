import React from 'react'
import CategoryEdit from 'modules/productCategories/edit';
import Categories from 'modules/productCategories/list';

export default () => (
  <div className="row row--no-gutter col-full-height">
    <div className="col-xs-12 col-sm-4 col-md-3 col--no-gutter scroll col-full-height">
      <Categories showAll={false} showTrash={false} showAdd={true} />
    </div>
    <div className="col-xs-12 col-sm-8 col-md-9 col--no-gutter scroll col-full-height">
      <CategoryEdit />
    </div>
  </div>
)
