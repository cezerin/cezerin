import React from 'react'
import Edit from 'modules/orderStatuses/edit';
import List from 'modules/orderStatuses/list';

export default () => (
  <div className="row row--no-gutter col-full-height">
    <div className="col-xs-3 col--no-gutter scroll col-full-height">
      <List showAll={false} showAdd={true} />
    </div>
    <div className="col-xs-9 col--no-gutter scroll col-full-height">
      <Edit />
    </div>
  </div>
)
