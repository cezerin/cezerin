import React from 'react'
import {Link} from 'react-router'
import moment from 'moment';

import messages from 'lib/text'
import * as helper from 'lib/helper'
import style from './style.css'

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

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

const OrderSummary = ({order, settings}) => {
  const dateCreated = moment(order.date_placed || order.date_created);
  const dateCreatedFormated = dateCreated.format(`${settings.date_format}, ${settings.time_format}`);
  const states = getOrderStates(order);

  let referrerDomain = order.referrer_url;

  try{
    const url = new URL(order.referrer_url);
    referrerDomain = url.hostname;
  } catch(e) {}

  return (
    <Paper className="paper-box" zDepth={1}>
      <div className={style.innerBox}>
        <div className="blue-title" style={{ paddingBottom:16, paddingTop:0 }}>{messages.order} #{order.number}</div>

        <div className={style.states}>
          {states}
        </div>

        <div className={style.summaryRow + " row"}>
          <div className="col-xs-5"><span>{messages.orderDate}</span></div>
          <div className="col-xs-7">{dateCreatedFormated}</div>
        </div>

        <div className={style.summaryRow + " row"}>
          <div className="col-xs-5"><span>{messages.orderStatus}</span></div>
          <div className="col-xs-7">{order.status}</div>
        </div>

        <div className={style.summaryRow + " row"}>
          <div className="col-xs-5"><span>{messages.referrer}</span></div>
          <div className="col-xs-7"><a className={style.link} href={order.referrer_url} target="_blank">{referrerDomain}</a></div>
        </div>

        <div className={style.summaryRow + " row"}>
          <div className="col-xs-5"><span>{messages.trackingNumber}</span></div>
          <div className="col-xs-7">{order.tracking_number}</div>
        </div>

        <div className={style.summaryRow + " row"}>
          <div className="col-xs-5"><span>{messages.shippingStatus}</span></div>
          <div className="col-xs-7">{order.shipping_status}</div>
        </div>

        <div className={style.summaryRow + " row"}>
          <div className="col-xs-5"><span>{messages.shippingMethod}</span></div>
          <div className="col-xs-7">{order.shipping_method}</div>
        </div>

        <div className={style.summaryRow + " row"}>
          <div className="col-xs-5"><span>{messages.paymentsMethod}</span></div>
          <div className="col-xs-7">{order.payment_method}</div>
        </div>

        <div className={style.summaryRow + " row"}>
          <div className="col-xs-5"><span>{messages.customerComment}</span></div>
          <div className="col-xs-7">{order.comments}</div>
        </div>

        <RaisedButton label="Edit" style={{ marginTop:20 }} />

      </div>
    </Paper>
  )
}

export default OrderSummary;
