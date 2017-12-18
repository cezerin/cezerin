import React from 'react'

import messages from 'lib/text'

import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
const Fragment = React.Fragment;

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

  deleteStatus = () => {
    this.setState({openDelete: false});
    this.props.onDelete(this.props.selected.id);
  };

  render() {
    const { selected, onDelete, onCreate } = this.props;
    const statusName = selected ? selected.name : '';

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
        onClick={this.deleteStatus}
      />,
    ];

    return (
      <span>
        {selected &&
          <Fragment>
            <IconButton touch={true} tooltip={messages.actions_delete} tooltipPosition="bottom-left" onClick={this.showDelete}>
              <FontIcon color="#fff" className="material-icons">delete</FontIcon>
            </IconButton>
            <Dialog
              title={messages.messages_deleteConfirmation}
              actions={actionsDelete}
              modal={false}
              open={this.state.openDelete}
              onRequestClose={this.closeDelete}
            >
              {messages.orderStatusDeleteAsk.replace('{name}', statusName)}
            </Dialog>
          </Fragment>
        }
        <IconButton touch={true} tooltipPosition="bottom-left" tooltip={messages.addOrderStatus} onClick={onCreate}>
          <FontIcon color="#fff" className="material-icons">add</FontIcon>
        </IconButton>
      </span>
    )
  }
}
