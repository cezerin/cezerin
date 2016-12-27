import React from 'react'
import ProductsList from 'modules/products/list';
import ProductsFilter from 'modules/products/filter';
import Categories from 'modules/product-categories/list';

export default () => (
  <div className="row row--no-gutter col-full-height">
    <div className="col-xs-3 col--no-gutter scroll col-categories">
      <Categories showAll={true} showAdd={false}/>
      <ProductsFilter />
    </div>
    <div className="col-xs-9 col--no-gutter scroll">
      <ProductsList />
    </div>
  </div>
)
