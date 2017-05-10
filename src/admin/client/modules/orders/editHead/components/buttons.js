import React from 'react'
import messages from 'lib/text'
import ConfirmationDialog from 'modules/shared/confirmation'

import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

export default class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showClose: false,
      showCancel: false,
      showDelete: false
    };
  }

  showClose = () => {
    this.setState({showClose: true});
  };

  hideClose = () => {
    this.setState({showClose: false});
  };

  setClosed = () => {
    this.hideClose();
    this.props.setClosed(this.props.order.id);
  };

  showCancel = () => {
    this.setState({showCancel: true});
  };

  hideCancel = () => {
    this.setState({showCancel: false});
  };

  setCancelled = () => {
    this.hideCancel();
    this.props.setCancelled(this.props.order.id);
  };

  showDelete = () => {
    this.setState({showDelete: true});
  };

  hideDelete = () => {
    this.setState({showDelete: false});
  };

  deleteOrder = () => {
    this.hideDelete();
    this.props.onDelete();
  };

  holdOrder = () => {
    this.props.holdOrder(this.props.order.id);
  };

  resumeOrder = () => {
    this.props.resumeOrder(this.props.order.id);
  };

  render() {
    const { order, onDelete } = this.props;

    if(order){
      const confirmationDialogTitle = `${messages.order} #${order.number}`;

      let menuItems = [];
      if(order.closed){
        //
      } else if(order.cancelled){
        //
      } else{
        if(order.hold){
          menuItems.push(<MenuItem key='resume' primaryText={messages.resumeOrder} onTouchTap={this.resumeOrder} />);
        } else {
          menuItems.push(<MenuItem key='hold' primaryText={messages.holdOrder} onTouchTap={this.holdOrder} />);
        }
        menuItems.push(<MenuItem key='close' primaryText={messages.closeOrder} onTouchTap={this.showClose} />);
        menuItems.push(<MenuItem key='cancel' primaryText={messages.cancelOrder} onTouchTap={this.showCancel} />);
      }

      return (
        <span>
          <ConfirmationDialog
            open={this.state.showClose}
            title={confirmationDialogTitle}
            description={messages.closeOrderConfirmation}
            onSubmit={this.setClosed}
            onCancel={this.hideClose}
            submitLabel={messages.closeOrder}
            cancelLabel={messages.cancel}
          />

          <ConfirmationDialog
            open={this.state.showCancel}
            title={confirmationDialogTitle}
            description={messages.cancelOrderConfirmation}
            onSubmit={this.setCancelled}
            onCancel={this.hideCancel}
            submitLabel={messages.cancelOrder}
            cancelLabel={messages.cancel}
          />

          <ConfirmationDialog
            open={this.state.showDelete}
            title={confirmationDialogTitle}
            description={messages.deleteOrderConfirmation}
            onSubmit={this.deleteOrder}
            onCancel={this.hideDelete}
            submitLabel={messages.deleteOrder}
            cancelLabel={messages.cancel}
          />

          <IconMenu
           iconButtonElement={
             <IconButton touch={true}>
               <FontIcon color="#fff" className="material-icons">more_vert</FontIcon>
             </IconButton>
           }
           targetOrigin={{horizontal: 'right', vertical: 'top'}}
           anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          >
            {menuItems}
            <MenuItem primaryText={messages.deleteOrder} onTouchTap={this.showDelete} />
          </IconMenu>
        </span>
      )
    } else {
      return <span></span>
    }
  }
}
