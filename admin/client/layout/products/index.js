import React from 'react'
import { Link } from 'react-router'
import ProductsList from 'modules/products/list';
import Categories from 'modules/product-categories/list';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import FontIcon from 'material-ui/FontIcon';
import Subheader from 'material-ui/Subheader';

export default () => (
  <div className="row row--no-gutter col-full-height">
    <div className="col-xs-3 col--no-gutter scroll col-categories">
      <Categories showAll={true} showTrash={true} showAdd={false}/>
    </div>
    <div className="col-xs-9 col--no-gutter scroll">
      <ProductsList />
      <Link to="/admin/product/add">
        <FloatingActionButton secondary={false} style={{position: 'fixed', right: '25px', bottom: '15px'}}>
          <FontIcon className="material-icons">add</FontIcon>
        </FloatingActionButton>
      </Link>
    </div>
  </div>
)
