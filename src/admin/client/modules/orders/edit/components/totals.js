import React from 'react'

import messages from 'lib/text'
import * as helper from 'lib/helper'
import style from './style.css'

import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

const OrderTotals = ({order, settings}) => {
  const discountTotal = helper.formatCurrency(order.discount_total, settings);
  const subtotal = helper.formatCurrency(order.subtotal, settings);
  const taxIncludedTotal = helper.formatCurrency(order.tax_included_total, settings);
  const taxTotal = helper.formatCurrency(order.tax_total, settings);
  const shippingTotal = helper.formatCurrency(order.shipping_total, settings);
  const grandTotal = helper.formatCurrency(order.grand_total, settings);
  const itemTax = helper.formatCurrency(order.item_tax, settings);
  const shippingTax = helper.formatCurrency(order.shipping_tax, settings);
  const shippingDiscount = helper.formatCurrency(order.shipping_discount, settings);
  const shippingPrice = helper.formatCurrency(order.shipping_price, settings);
  let discountsDescription = order.coupon && order.coupon.length > 0 ? ` (${messages.coupon}: ${order.coupon})` : '';

  let transactionsTotal = 0;
  for(const transaction of order.transactions){
    if(transaction.success === true){
      transactionsTotal += transaction.amount;
    }
  }
  const paidTotal = helper.formatCurrency(transactionsTotal, settings);

  return (
    <div>
      <div className={style.total + " row"}>
        <div className="col-xs-7"><span>{messages.orderSubtotal}</span></div>
        <div className="col-xs-5">{subtotal}</div>
      </div>
      <div className={style.total + " row"}>
        <div className="col-xs-7"><span>{messages.orderShipping}</span></div>
        <div className="col-xs-5">{shippingTotal}</div>
      </div>
      <div className={style.total + " row"}>
        <div className="col-xs-7"><span>{messages.orderTax}</span></div>
        <div className="col-xs-5">{taxIncludedTotal}</div>
      </div>
      <div className={style.total + " row"}>
        <div className="col-xs-7"><span>{messages.orderDiscount}{discountsDescription}</span></div>
        <div className="col-xs-5">{discountTotal}</div>
      </div>
      <div className={style.total + " row " + style.grandTotal}>
        <div className="col-xs-7">{messages.grandTotal}</div>
        <div className="col-xs-5">{grandTotal}</div>
      </div>

      <Divider style={{
        marginTop: 20,
        marginBottom: 20
      }}/>

      <div className={style.total + " row"}>
        <div className="col-xs-7"><span>{messages.amountPaid}</span></div>
        <div className="col-xs-5">{paidTotal}</div>
      </div>

    </div>
  )
}

export default OrderTotals;
