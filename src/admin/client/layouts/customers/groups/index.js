import React from 'react'
import GroupEdit from 'modules/customer-groups/edit';
import Groups from 'modules/customer-groups/list';

export default () => (
  <div className="row row--no-gutter col-full-height">
    <div className="col-xs-3 col--no-gutter scroll right-border">
      <Groups showAll={false} showRoot={false} showAdd={true} />
    </div>
    <div className="col-xs-9 col--no-gutter scroll">
      <GroupEdit />
    </div>
  </div>
)
