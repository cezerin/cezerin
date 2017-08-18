import React from 'react'
import { Link } from 'react-router-dom'

import messages from 'lib/text'

import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Search from './search';

export default class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDelete: false
    };
  }

  showDelete = () => {
    this.setState({openDelete: true});
  };

  closeDelete = () => {
    this.setState({openDelete: false});
  };

  deleteOrders = () => {
    this.setState({openDelete: false});
    this.props.onDelete();
  };

  render() {
    const { search, setSearch, selectedCount, onDelete } = this.props;

    const actionsDelete = [
      <FlatButton
        label={messages.cancel}
        onClick={this.closeDelete}
        style={{ marginRight: 10 }}
      />,
      <FlatButton
        label={messages.actions_delete}
        primary={true}
        keyboardFocused={true}
        onClick={this.deleteOrders}
      />,
    ];

    return (
      <span>
        <Search value={search} setSearch={setSearch} />
        {selectedCount > 0 &&
          <span>
            <IconButton touch={true} tooltip={messages.actions_delete} onClick={this.showDelete}>
              <FontIcon color="#fff" className="material-icons">delete</FontIcon>
            </IconButton>
            <Dialog
              title={messages.messages_deleteForever}
              actions={actionsDelete}
              modal={false}
              open={this.state.openDelete}
              onRequestClose={this.closeDelete}
              >
              {messages.orders_aboutDelete.replace('{count}', selectedCount)}
            </Dialog>
          </span>
        }
        <IconMenu
         iconButtonElement={
           <IconButton touch={true}>
             <FontIcon color="#fff" className="material-icons">more_vert</FontIcon>
           </IconButton>
         }
         targetOrigin={{horizontal: 'right', vertical: 'top'}}
         anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          <MenuItem containerElement={<Link to="/admin/orders/statuses" />} primaryText={messages.manageOrderStatuses} />
        </IconMenu>
      </span>
    )
  }
}
