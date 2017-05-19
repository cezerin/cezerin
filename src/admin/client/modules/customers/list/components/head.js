import React from 'react'
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import messages from 'lib/text'

export default ({ onSelectAll }) => (
  <Subheader style={{ paddingRight:16 }}>
    <div className="row middle-xs">
      <div className="col-xs-1">
        <Checkbox onCheck={(event, isInputChecked) => { onSelectAll(isInputChecked); }} />
      </div>
      <div className="col-xs-5">
        {messages.customers_name}
      </div>
      <div className="col-xs-3">
        {messages.customers_location}
      </div>
      <div className="col-xs-1">
        {messages.customers_orders}
      </div>
      <div className="col-xs-2" style={{ textAlign:'right', paddingRight: 16 }}>
        {messages.customers_totalSpent}
      </div>
    </div>
  </Subheader>
)
