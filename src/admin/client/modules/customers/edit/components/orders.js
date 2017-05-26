import React from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment';

import api from 'lib/api'
import messages from 'lib/text'
import * as helper from 'lib/helper'
import style from './style.css'

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import {List, ListItem} from 'material-ui/List';

const getOrderStates = (order) => {
  let states = [];

  if(order.hold) {
    states.push(<span key="hold" className={style.holdState}>{messages.orders_hold}</span>);
  }

  if(order.paid) {
    states.push(<span key="paid" className={style.paidState}>{messages.orders_paid}</span>);
  }

  if(order.delivered) {
    states.push(<span key="delivered" className={style.deliveredState}>{messages.orders_delivered}</span>);
  }

  if(order.cancelled) {
    return [<span key="cancelled" className={style.cancelledState}>{messages.orders_cancelled}</span>];
  }

  if(order.closed) {
    return [<span key="closed" className={style.closedState}>{messages.orders_closed}</span>];
  }

  if(states.length === 0 && order.draft){
    states.unshift(<span key="draft" className={style.draftState}>{messages.orders_draft}</span>);
  }

  return states;
}

const CustomerOrder = ({ order, settings }) => {
  let grandTotalFormatted = helper.formatCurrency(order.grand_total, settings);
  const dateCreated = moment(order.date_placed || order.date_created);
  const dateCreatedFormated = dateCreated.format(settings.date_format);
  const states = getOrderStates(order);

  return (
    <div>
      <Divider />
      <Link to={`/admin/order/${order.id}`} style={{ textDecoration: 'none' }}>
        <ListItem
          rightIcon={<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>}
          primaryText={<div className="row">
            <div className="col-xs-2">
              {order.number}
            </div>
            <div className="col-xs-3" style={{ color: 'rgba(0, 0, 0, 0.4)' }}>
              {dateCreatedFormated}
            </div>
            <div className="col-xs-4">
              <div className={style.states}>{states}</div>
            </div>
            <div className="col-xs-3" style={{ textAlign: 'right' }}>
              {grandTotalFormatted}
            </div>
          </div>}
        />
      </Link>
    </div>
  )
}

export default class CustomerOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: []
    };
  }

  componentDidMount() {
    api.orders.list({ customer_id: this.props.customerId }).then(({status, json}) => {
      this.setState({orders: json.data});
    })
  }

  render() {
    const {customerId, settings} = this.props;
    const {orders} = this.state;

    let orderItems = [];
    if(orders.length > 0) {
      orderItems = orders.map((order, index) => <CustomerOrder key={index} order={order} settings={settings} />)
    }

    return (
      <Paper className="paper-box" zDepth={1}>
        <div className="blue-title" style={{ paddingLeft: 16, paddingBottom: 16 }}>{messages.customers_orders}</div>
        <List style={{ padding: 0 }}>
          {orderItems}
        </List>
      </Paper>
    )
  }
}
