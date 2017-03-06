import React from 'react'
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import messages from 'lib/text'

export default ({ onSelectAll }) => (
  <Subheader>
    <div className="row row--no-gutter middle-xs">
      <div className="col-xs-1 col--no-gutter">
        <Checkbox onCheck={(event, isInputChecked) => { onSelectAll(isInputChecked); }} />
      </div>
      <div className="col-xs-1 col--no-gutter">
      </div>
      <div className="col-xs-2 col--no-gutter">
        {messages.orders_order}
      </div>
      <div className="col-xs-4 col--no-gutter">
        {messages.orders_shippingTo}
      </div>
      <div className="col-xs-2 col--no-gutter" style={{ textAlign:'right' }}>
        {messages.orders_total}
      </div>
      <div className="col-xs-2 col--no-gutter" style={{ textAlign:'right', paddingRight: 16 }}>
        {messages.orders_status}
      </div>
    </div>
  </Subheader>
)
