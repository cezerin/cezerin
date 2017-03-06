import React from 'react'
import messages from 'lib/text'

import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';

export default class TokensList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.onLoad();
  }

  render() {
    const {tokens, pushUrl} = this.props;

    let listItems = tokens.map(token =>
      <div key={token.id}>
        <ListItem
          rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
          primaryText={token.name}
          secondaryText={token.email}
          onClick={() => { pushUrl(`/admin/settings/tokens/${token.id}`) }}
        />
        <Divider />
      </div>
    )

    return (
      <div className="row row--no-gutter col-full-height col--no-gutter scroll">
          <div style={{padding: '10px 20px', width: '100%'}}>
            <div style={{color: 'rgba(0,0,0,0.4)', paddingTop: 20}}>{messages.settings.tokenHelp}</div>
            <List>
              {listItems}
            </List>
          </div>
          <FloatingActionButton secondary={false} style={{position: 'fixed', right: '25px', bottom: '15px'}} onTouchTap={() => { pushUrl('/admin/settings/tokens/add') }}>
            <FontIcon className="material-icons">add</FontIcon>
          </FloatingActionButton>
      </div>
    )
  }
}
