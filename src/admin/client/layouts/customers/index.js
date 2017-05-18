import React from 'react'
import CustomersList from 'modules/customers/list';
import Groups from 'modules/customerGroups/list';

export default () => (
  <div className="row row--no-gutter col-full-height">
    <div className="col-xs-3 col--no-gutter scroll col-full-height">
      <Groups showAll={true} showRoot={false} showAdd={false}/>
    </div>
    <div className="col-xs-9 col--no-gutter scroll col-full-height">
      <CustomersList />
    </div>
  </div>
)
