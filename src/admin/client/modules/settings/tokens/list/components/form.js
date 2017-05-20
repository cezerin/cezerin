import React from 'react'
import {Link} from 'react-router'
import messages from 'lib/text'

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';

const TokenItem = ({token}) => {
  return (
    <div>
      <Divider />
      <Link to={`/admin/settings/tokens/${token.id}`} style={{ textDecoration: 'none' }}>
        <ListItem
          rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
          primaryText={<div className="row">
            <div className="col-xs-6">{token.name}</div>
            <div className="col-xs-6" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>{token.email}</div>
          </div>}
        />
     </Link>
    </div>
  )
}

export default class TokensList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.onLoad();
  }

  render() {
    const {tokens, pushUrl} = this.props;
    let listItems = tokens.map((token, index) => <TokenItem key={index} token={token} />)

    return (
      <Paper className="paper-box" zDepth={1}>
          <div style={{width: '100%'}}>
            <div className="blue-title" style={{paddingLeft: 16, paddingBottom: 16}}>{messages.settings_tokenHelp}</div>
            <List style={{ padding: 0 }}>
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
