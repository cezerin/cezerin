import React from 'react'
import {Link} from 'react-router'

import messages from 'lib/text'
import * as helper from 'lib/helper'
import style from './style.css'

import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

const Address = ({ address }) => {
  return (
    <div className={style.address}>
      <div>{address.full_name}</div>
      <div>{address.company}</div>
      <div>{address.address1}</div>
      <div>{address.address2}</div>
      <div>{address.city}, {address.state && address.state.length > 0 ? address.state + ', ' : ''}{address.zip}</div>
      <div>{address.country}</div>
      <div>{address.phone}</div>
    </div>
  )
}

const OrderCustomer = ({order}) => {
  let mapAddress = `${order.shipping_address.address1} ${order.shipping_address.city} ${order.shipping_address.state} ${order.shipping_address.zip}`;
  mapAddress = mapAddress.replace(/ /g, '+');
  const mapUrl = `https://www.google.com/maps/place/${mapAddress}`;

  return (
    <Paper className="paper-box" zDepth={1}>
      <div className={style.innerBox}>
        <div className="blue-title" style={{ paddingBottom:16, paddingTop:0 }}>{messages.customer}</div>

        <div className={style.address}>
          <div><Link to={`/admin/customer/${order.customer_id}`} className={style.link}>{order.customer && order.customer.full_name}</Link></div>
          <div><a href={"MailTo:" + order.email} className={style.link}>{order.email}</a></div>
          <div>{order.mobile}</div>
        </div>

        <Divider style={{
          marginTop: 30,
          marginBottom: 30
        }}/>

        <div style={{ paddingBottom:16, paddingTop:0 }}>{messages.shippingAddress}</div>
        <Address address={order.shipping_address} />

        <RaisedButton label="Edit" style={{ marginTop:20 }} />
        <a href={mapUrl} target="_blank"><FlatButton label="View map" style={{ marginLeft:15 }} /></a>

        <Divider style={{
          marginTop: 30,
          marginBottom: 30
        }}/>

        <div style={{ paddingBottom:16, paddingTop:0 }}>{messages.billingAddress}</div>
        <div className={style.address}>{messages.sameAsShipping}</div>

      </div>
    </Paper>
  )
}

export default OrderCustomer;
