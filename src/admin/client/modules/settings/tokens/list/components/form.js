import React from 'react'
import messages from 'lib/text'

import Paper from 'material-ui/Paper';
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
      <Paper className="paper-box" zDepth={1}>
          <div style={{width: '100%'}}>
            <div style={{color: 'rgba(0,0,0,0.4)', padding: '30px 0 10px 15px'}}>{messages.settings_tokenHelp}</div>
            <List>
              {listItems}
            </List>
          </div>
          <FloatingActionButton secondary={false} style={{position: 'fixed', right: '25px', bottom: '15px', zIndex: 1}} onTouchTap={() => { pushUrl('/admin/settings/tokens/add') }}>
            <FontIcon className="material-icons">add</FontIcon>
          </FloatingActionButton>
      </Paper>
    )
  }
}
