import React from 'react'
import messages from 'lib/text'
import ConfirmationDialog from 'modules/shared/confirmation'
import ProductSearchDialog from 'modules/shared/productSearch'
import DeleteConfirmation from 'modules/shared/deleteConfirmation'
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

export default class Buttons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showClose: false,
      showCancel: false,
      openDelete: false,
      showAddItem: false
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

  openDelete = () => {
    this.setState({openDelete: true});
  };

  closeDelete = () => {
    this.setState({openDelete: false});
  };

  deleteOrder = () => {
    this.closeDelete();
    this.props.onDelete();
  };

  holdOrder = () => {
    this.props.holdOrder(this.props.order.id);
  };

  resumeOrder = () => {
    this.props.resumeOrder(this.props.order.id);
  };

  showAddItem = () => {
    this.setState({showAddItem: true});
  };

  hideAddItem = () => {
    this.setState({showAddItem: false});
  };

  addItem = (productId) => {
    this.hideAddItem();
    this.props.addItem(this.props.order.id, productId);
  }

  render() {
    const { settings, order, onDelete } = this.props;

    if(order){
      const orderName = `${messages.order} #${order.number}`;

      let menuItems = [];
      if(order.closed){
        //
      } else if(order.cancelled){
        //
      } else{
        menuItems.push(<MenuItem key="addItem" primaryText={messages.addOrderItem} onClick={this.showAddItem} />);
        menuItems.push(<Divider key="dev1" />);
        if(order.hold){
          menuItems.push(<MenuItem key="resume" primaryText={messages.resumeOrder} onClick={this.resumeOrder} />);
        } else {
          menuItems.push(<MenuItem key="hold" primaryText={messages.holdOrder} onClick={this.holdOrder} />);
        }
        menuItems.push(<MenuItem key="close" primaryText={messages.closeOrder} onClick={this.showClose} />);
        menuItems.push(<MenuItem key="cancel" primaryText={messages.cancelOrder} onClick={this.showCancel} />);
      }

      return (
        <span>
          <ProductSearchDialog
            open={this.state.showAddItem}
            title={messages.addOrderItem}
            settings={settings}
            onSubmit={this.addItem}
            onCancel={this.hideAddItem}
            submitLabel={messages.add}
            cancelLabel={messages.cancel}
          />

          <ConfirmationDialog
            open={this.state.showClose}
            title={orderName}
            description={messages.closeOrderConfirmation}
            onSubmit={this.setClosed}
            onCancel={this.hideClose}
            submitLabel={messages.closeOrder}
            cancelLabel={messages.cancel}
          />

          <ConfirmationDialog
            open={this.state.showCancel}
            title={orderName}
            description={messages.cancelOrderConfirmation}
            onSubmit={this.setCancelled}
            onCancel={this.hideCancel}
            submitLabel={messages.cancelOrder}
            cancelLabel={messages.cancel}
          />

          <DeleteConfirmation
            open={this.state.openDelete}
            isSingle={true}
            itemsCount={1}
            itemName={orderName}
            onCancel={this.closeDelete}
            onDelete={this.deleteOrder}
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
            <MenuItem primaryText={messages.deleteOrder} onClick={this.openDelete} />
          </IconMenu>
        </span>
      )
    } else {
      return <span></span>
    }
  }
}
