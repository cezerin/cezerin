import React from 'react'
import messages from 'src/locales'

import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';

export default class EmailSettings extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.onLoad();
  }

  render() {
    const {shippingMethods, pushUrl} = this.props;

    let methods = shippingMethods.map(method =>
      <div key={method.id}>
        <ListItem
          rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
          style={!method.enabled ? {color: 'rgba(0, 0, 0, 0.3)'} : {}}
          primaryText={method.name}
          secondaryText={method.description}
          onClick={() => { pushUrl(`/admin/settings/shipping/${method.id}`) }}
        />
        <Divider />
      </div>
    )

    return (
      <div className="row row--no-gutter col-full-height col--no-gutter scroll">
          <div style={{padding: '10px 20px', width: '100%'}}>
          <List>
            {methods}
          </List>
          </div>
          <FloatingActionButton secondary={false} style={{position: 'fixed', right: '25px', bottom: '15px'}} onTouchTap={() => { pushUrl('/admin/settings/shipping/add') }}>
            <FontIcon className="material-icons">add</FontIcon>
          </FloatingActionButton>
      </div>
    )
  }
}
