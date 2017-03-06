import React from 'react'
import Subheader from 'material-ui/Subheader';
import Checkbox from 'material-ui/Checkbox';
import messages from 'lib/text'

export default ({ onSelectAll }) => (
  <Subheader>
    <div className="row row--no-gutter middle-xs">
      <div className="col-xs-6 col--no-gutter">
        <div className="row row--no-gutter middle-xs">
          <div className="col-xs-1 col--no-gutter">
            <Checkbox onCheck={(event, isInputChecked) => { onSelectAll(isInputChecked); }} />
          </div>
          <div className="col-xs-11">
            {messages.products.name}
          </div>
        </div>
      </div>
      <div className="col-xs-2 col--no-gutter">
        {messages.products.sku}
      </div>
      <div className="col-xs-2 col--no-gutter">
        {messages.products.stock}
      </div>
      <div className="col-xs-2 col--no-gutter" style={{ textAlign:'right', paddingRight: 23 }}>
        {messages.products.price}
      </div>
    </div>
  </Subheader>
)
