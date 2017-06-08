import React from 'react'

import messages from 'lib/text'

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
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
    this.props.onDelete(this.props.shippingMethod.id);
  };

  render() {
    const { shippingMethod, onDelete } = this.props;
    const methodName = shippingMethod ? shippingMethod.name : '';

    const actionsDelete = [
      <FlatButton
        label={messages.cancel}
        onTouchTap={this.closeDelete}
        style={{ marginRight: 10 }}
      />,
      <FlatButton
        label={messages.actions_delete}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.deleteGroup}
      />,
    ];

    return (
      <span>
        <IconButton touch={true} tooltipPosition="bottom-left" tooltip={messages.actions_delete} onTouchTap={this.showDelete}>
          <FontIcon color="#fff" className="material-icons">delete</FontIcon>
        </IconButton>

        <Dialog
          title={messages.messages_deleteConfirmation}
          actions={actionsDelete}
          modal={false}
          open={this.state.openDelete}
          onRequestClose={this.closeDelete}
        >
          {messages.settings_aboutDeleteShippingMethod.replace('{name}', methodName)}
        </Dialog>
      </span>
    )
  }
}
