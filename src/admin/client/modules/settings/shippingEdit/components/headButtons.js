import React from 'react'

import messages from 'src/locales'

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
          {messages.settings.aboutDeleteShippingMethod.replace('{name}', methodName)}
        </Dialog>
      </span>
    )
  }
}
