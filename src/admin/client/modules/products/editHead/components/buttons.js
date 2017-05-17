import React from 'react'
import { Link } from 'react-router'
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
    const {product} = this.props;

    const actionsDelete = [
      <FlatButton
        label={messages.cancel}
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
        <IconButton touch={true} tooltipPosition="bottom-left" tooltip={messages.deleteProduct} onTouchTap={this.showDelete}>
          <FontIcon color="#fff" className="material-icons">delete</FontIcon>
        </IconButton>
        {product && product.enabled &&
          <a href={product.url} target="_blank">
            <IconButton touch={true} tooltipPosition="bottom-left" tooltip={messages.viewOnWebsite}>
              <FontIcon color="#fff" className="material-icons">open_in_new</FontIcon>
            </IconButton>
          </a>
        }
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
