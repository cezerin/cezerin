import React from 'react'
import messages from 'lib/text'

import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';

export default class EmailSettings extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.onLoad();
  }

  getFieldStatus = (fieldName) => {
    const fields = this.props.checkoutFields || [];
    const field = fields.find(item => item.name === fieldName);
    const fieldStatus = field ? field.status : 'required';
    switch (fieldStatus) {
      case 'optional':
        return messages.settings_fieldOptional;
        break;
      case 'hidden':
        return messages.settings_fieldHidden;
        break;
      default:
        return messages.settings_fieldRequired;
    }
  }

  render() {
    const {checkoutFields, pushUrl} = this.props;

    return (
      <div className="row row--no-gutter col-full-height col--no-gutter scroll">
          <div style={{padding: '10px 20px', width: '100%'}}>
          <List>
            <div className="blue-title" style={{paddingLeft: 16, paddingBottom: 16}}>{messages.settings_checkoutFields}</div>
            <ListItem
              rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
              primaryText={messages.email}
              secondaryText={this.getFieldStatus('email')}
              onClick={() => { pushUrl('/admin/settings/checkout/fields/email') }}
            />
            <Divider />
            <ListItem
              rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
              primaryText={messages.mobile}
              secondaryText={this.getFieldStatus('mobile')}
              onClick={() => { pushUrl('/admin/settings/checkout/fields/mobile') }}
            />
            <Divider />
            <ListItem
              rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
              primaryText={messages.country}
              secondaryText={this.getFieldStatus('country')}
              onClick={() => { pushUrl('/admin/settings/checkout/fields/country') }}
            />
            <Divider />
            <ListItem
              rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
              primaryText={messages.state}
              secondaryText={this.getFieldStatus('state')}
              onClick={() => { pushUrl('/admin/settings/checkout/fields/state') }}
            />
            <Divider />
            <ListItem
              rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
              primaryText={messages.city}
              secondaryText={this.getFieldStatus('city')}
              onClick={() => { pushUrl('/admin/settings/checkout/fields/city') }}
            />
            <Divider />
          </List>
          </div>
      </div>
    )
  }
}
