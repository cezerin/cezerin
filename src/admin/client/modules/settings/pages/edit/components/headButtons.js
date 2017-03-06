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
    this.props.onDelete(this.props.page.id);
  };

  render() {
    const { page, onDelete } = this.props;
    const pageName = page ? page.meta_title : '';

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
        onTouchTap={this.deleteGroup}
      />,
    ];

    if(page.is_system) {
      return null;
    } else {
      return (
        <span>
          <IconButton touch={true} tooltip={messages.actions_delete} onTouchTap={this.showDelete}>
            <FontIcon color="#fff" className="material-icons">delete</FontIcon>
          </IconButton>

          <Dialog
            title={messages.messages_deleteConfirmation}
            actions={actionsDelete}
            modal={false}
            open={this.state.openDelete}
            onRequestClose={this.closeDelete}
          >
            {messages.settings_aboutDeletePage.replace('{name}', pageName)}
          </Dialog>
        </span>
      )
    }
  }
}
