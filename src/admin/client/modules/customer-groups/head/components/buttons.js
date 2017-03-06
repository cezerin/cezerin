import React from 'react'

import messages from 'lib/text'

import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openDelete: false,
    };
  }

  showDelete = () => {
    this.setState({openDelete: true});
  };

  closeDelete = () => {
    this.setState({openDelete: false});
  };

  deleteGroup = () => {
    this.setState({openDelete: false});
    this.props.onDelete(this.props.selected.id);
  };

  render() {
    const { selected, onDelete } = this.props;
    const groupName = selected ? selected.name : '';

    const actionsDelete = [
      <FlatButton
        label={messages.actions.cancel}
        primary={true}
        onTouchTap={this.closeDelete}
      />,
      <FlatButton
        label={messages.actions.delete}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.deleteGroup}
      />,
    ];

    return (
      <span>
        <IconButton touch={true} tooltip={messages.actions.delete} onTouchTap={this.showDelete}>
          <FontIcon color="#fff" className="material-icons">delete</FontIcon>
        </IconButton>

        <Dialog
          title={messages.messages.deleteConfirmation}
          actions={actionsDelete}
          modal={false}
          open={this.state.openDelete}
          onRequestClose={this.closeDelete}
        >
          {messages.customerGroups.aboutDelete.replace('{name}', groupName)}
        </Dialog>
      </span>
    )
  }
}
