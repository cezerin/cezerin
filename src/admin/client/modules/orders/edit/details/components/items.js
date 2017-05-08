import React from 'react'
import {Link} from 'react-router'

import messages from 'lib/text'
import * as helper from 'lib/helper'
import style from './style.css'

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Dialog from 'material-ui/Dialog';

const iconButtonElement = (
  <IconButton touch={true}>
    <FontIcon color="rgb(189, 189, 189)" className="material-icons">more_vert</FontIcon>
  </IconButton>
);

export class OrderItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: props.item.quantity,
      showEdit: false
    };
  }

  showEditForm = () => {
    this.setState({showEdit: true});
  };

  quantityChange = (event, index, value) => {
    this.setState({quantity: value});
  };

  hideEditForm = () => {
    this.setState({showEdit: false});
  };

  submitEditForm = () => {
    this.hideEditForm();
    this.props.onItemUpdate(this.props.item.id, this.state.quantity)
  };

  deleteItem = () => {
    this.props.onItemDelete(this.props.item.id);
  }

  render() {
    const {item, settings} = this.props;

    const editFormActions = [
      <FlatButton
        label={messages.cancel}
        primary={true}
        onTouchTap={this.hideEditForm}
      />,
      <FlatButton
        label={messages.save}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.submitEditForm}
      />,
    ];

    const price = helper.formatCurrency(item.price, settings);
    const priceTotal = helper.formatCurrency(item.price_total, settings);
    const discountTotal = helper.formatCurrency(item.discount_total, settings);
    const imageUrl = helper.getThumbnailUrl(item.image_url, 100);
    const quantityItems = [...Array(100)].map((_, i) => <MenuItem key={i} value={i} primaryText={i.toString()} />);

    return (
      <div>
        <div className={style.item + " row row--no-gutter middle-xs"}>
          <div className="col-xs-2">
            {imageUrl && imageUrl !== '' &&
              <img src={imageUrl} className={style.itemImage} />
            }
          </div>
          <div className={style.itemName + " col-xs-4"}>
            <Link to={`/admin/product/${item.product_id}/inventory`}>{item.name}</Link>
            <div>{item.variant_name}</div>
            <div>{messages.products_sku}: {item.sku}</div>
          </div>
          <div className="col-xs-2" style={{ textAlign: 'right' }}>{price}</div>
          <div className="col-xs-1" style={{ textAlign: 'center' }}>x {item.quantity}</div>
          <div className="col-xs-2" style={{ textAlign: 'right' }}>
            {priceTotal}
            {item.discount_total > 0 &&
              <small className={style.itemDiscount}>{discountTotal}</small>
            }
          </div>
          <div className="col-xs-1" style={{ textAlign: 'center' }}>
            <IconMenu iconButtonElement={iconButtonElement}>
              <MenuItem onTouchTap={this.showEditForm}>{messages.changeQuantity}</MenuItem>
              <MenuItem onTouchTap={this.deleteItem}>{messages.actions_delete}</MenuItem>
            </IconMenu>
          </div>
        </div>
        <Divider />
        <Dialog
          title={messages.changeQuantity}
          actions={editFormActions}
          modal={false}
          open={this.state.showEdit}
          onRequestClose={this.hideEditForm}
          contentStyle={{ width: 400 }}
        >
          <div className="row middle-xs">
            <div style={{ marginLeft: 10 }}>{messages.quantity}: </div>
            <div>
              <DropDownMenu
                value={this.state.quantity}
                onChange={this.quantityChange}>
                {quantityItems}
              </DropDownMenu>
            </div>
          </div>
        </Dialog>
      </div>
    )
  }
}

const OrderItems = ({order, settings, onItemDelete, onItemUpdate}) => {
  const items = order.items.map((item, index) => <OrderItem key={index} item={item} settings={settings} onItemDelete={onItemDelete} onItemUpdate={onItemUpdate} />)
  return (
    <div>
      {items}
    </div>
  )
}

export default OrderItems;
