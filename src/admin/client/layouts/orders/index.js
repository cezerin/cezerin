import React from 'react'
import OrdersList from 'modules/orders/list';
import OrdersFilter from 'modules/orders/filter';

export default () => (
  <div className="row row--no-gutter col-full-height">
    <div className="col-xs-3 col--no-gutter scroll col-full-height">
      <OrdersFilter />
    </div>
    <div className="col-xs-9 col--no-gutter scroll col-full-height">
      <OrdersList />
    </div>
  </div>
)
