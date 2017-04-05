import React from 'react'
import messages from 'lib/text'

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';
import FloatingActionButton from 'material-ui/FloatingActionButton';

export default class PagesList extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.onLoad();
  }

  render() {
    const {pages, pushUrl} = this.props;

    let listItems = pages.map(page =>
      <div key={page.id}>
        <ListItem
          rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
          leftIcon={page.is_system ? <FontIcon className="material-icons">lock_outline</FontIcon> : null}
          style={!page.enabled ? {color: 'rgba(0, 0, 0, 0.3)'} : {}}
          primaryText={page.meta_title}
          secondaryText={page.path}
          onClick={() => { pushUrl(`/admin/settings/pages/${page.id}`) }}
        />
        <Divider />
      </div>
    )

    return (
      <Paper className="paper-box" zDepth={1}>
          <div style={{width: '100%'}}>
          <List>
            {listItems}
          </List>
          </div>
          <FloatingActionButton secondary={false} style={{position: 'fixed', right: '25px', bottom: '15px', zIndex: 1}} onTouchTap={() => { pushUrl('/admin/settings/pages/add') }}>
            <FontIcon className="material-icons">add</FontIcon>
          </FloatingActionButton>
      </Paper>
    )
  }
}
