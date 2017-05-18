import React from 'react'
import GroupEdit from 'modules/customerGroups/edit';
import Groups from 'modules/customerGroups/list';

export default () => (
  <div className="row row--no-gutter col-full-height">
    <div className="col-xs-3 col--no-gutter scroll col-full-height right-border">
      <Groups showAll={false} showRoot={false} showAdd={true} />
    </div>
    <div className="col-xs-9 col--no-gutter scroll col-full-height">
      <GroupEdit />
    </div>
  </div>
)
