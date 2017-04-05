import React from 'react'
import messages from 'lib/text'

import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

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

  deleteProduct = () => {
    this.setState({openDelete: false});
    this.props.onDelete();
  };

  render() {
    const actionsDelete = [
      <FlatButton
        label={messages.actions_cancel}
        primary={true}
        onTouchTap={this.closeDelete}
      />,
      <FlatButton
        label={messages.actions_delete}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.deleteProduct}
      />,
    ];

    return (
      <span>
        <IconButton touch={true} tooltipPosition="bottom-left" tooltip={messages.actions_delete} onTouchTap={this.showDelete}>
          <FontIcon color="#fff" className="material-icons">delete</FontIcon>
        </IconButton>
        <Dialog
          title={messages.messages_deleteForever}
          actions={actionsDelete}
          modal={false}
          open={this.state.openDelete}
          onRequestClose={this.closeDelete}
          >
          {messages.products_aboutDelete.replace('{count}', '1')}
        </Dialog>
      </span>
    )
  }
}
