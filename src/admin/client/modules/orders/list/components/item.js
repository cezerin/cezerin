import React from 'react';
import { Link } from 'react-router'
import Checkbox from 'material-ui/Checkbox';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import messages from 'lib/text'
import * as helper from 'lib/helper'
import style from './style.css'
import moment from 'moment';

const getOrderStateIcons = (order) => {
  let icons = [];

  if(order.hold) {
    icons.push(<FontIcon title={messages.orders_hold} style={{ color: 'rgba(0, 0, 0, 0.2)'}} className="material-icons">pause_circle_outline</FontIcon>);
  }

  if(order.paid) {
    icons.push(<FontIcon title={messages.orders_paid} style={{ color: 'rgba(251, 184, 41, 1)'}} className="material-icons">monetization_on</FontIcon>);
  }

  if(order.delivered) {
    icons.push(<FontIcon title={messages.orders_delivered} style={{ color: 'rgba(127, 175, 27, 1)'}} className="material-icons">local_shipping</FontIcon>);
  }

  if(order.cancelled) {
    return [<FontIcon title={messages.orders_cancelled} style={{ color: 'rgba(0, 0, 0, 0.3)'}} className="material-icons">not_interested</FontIcon>];
  }

  if(order.closed) {
    return [<FontIcon title={messages.orders_closed} style={{ color: 'rgba(127, 175, 27, 1)'}} className="material-icons">done</FontIcon>];
  }

  if(icons.length === 0 && order.draft){
    icons.unshift(<FontIcon title={messages.orders_draft} style={{ color: 'rgba(0, 0, 0, 0.1)'}} className="material-icons">edit</FontIcon>);
  }

  return icons;
}

const OrdersListItem = ({ order, onSelect, selected, settings }) => {
  const checked = selected.includes(order.id);
  let grandTotalFormatted = helper.formatCurrency(order.grand_total, settings);

  const stateIcons = getOrderStateIcons(order);
  const dateCreated = moment(order.date_placed || order.date_created);
  const dateCreatedFromNow = dateCreated.fromNow();
  let shippingTo = order.shipping_address ? order.shipping_address.full_name : '';

  return (
    <div className="orders-item">
      <ListItem style={{ cursor: 'normal' }}
        primaryText={
          <div className="row middle-xs">
            <div className="col-xs-1">
              <Checkbox checked={checked} onCheck={(event, isInputChecked) => { onSelect(order.id, isInputChecked); }} />
            </div>
            <div className="col-xs-1">
              {stateIcons}
            </div>
            <div className={"col-xs-2 " + style.col}>
              <Link to={`/admin/order/${order.id}`} className={style.orderName}>{order.number || 0}</Link><br />
              <small>{dateCreatedFromNow}</small>
            </div>
            <div className={"col-xs-4 " + style.col}>
              {shippingTo}<br />
              <small>{order.shipping_method}</small>
            </div>
            <div className={"col-xs-2 " + style.price}>
              {grandTotalFormatted}<br />
              <small>{order.payment_method}</small>
            </div>
            <div className={"col-xs-2 " + style.status}>
              {order.status}
            </div>
          </div>
        }
      />
      <Divider />
    </div>
  )
}

export default OrdersListItem;
