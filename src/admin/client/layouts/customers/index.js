import React from 'react'
// import CustomersList from 'modules/customer/list';
import Groups from 'modules/customer-groups/list';

export default () => (
  <div className="row row--no-gutter col-full-height">
    <div className="col-xs-3 col--no-gutter scroll col-categories">
      <Groups showAll={true} showAdd={false}/>
    </div>
    <div className="col-xs-9 col--no-gutter scroll">
      {/* <ProductsList /> */}
    </div>
  </div>
)
