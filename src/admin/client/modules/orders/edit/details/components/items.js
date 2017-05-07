import React from 'react'
import {Link} from 'react-router'

import messages from 'lib/text'
import * as helper from 'lib/helper'
import style from './style.css'

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

const iconButtonElement = (
  <IconButton touch={true}>
    <FontIcon color="rgb(189, 189, 189)" className="material-icons">more_vert</FontIcon>
  </IconButton>
);

const OrderItem = ({item, settings, onItemDelete}) => {
  // "id": "590c2d7fda474b325d55df83",
  // "product_id": "58f0c6ba3c5392482f8bc037",
  // "variant_id": "58f0c76b3c5392482f8bc03e",

  const price = helper.formatCurrency(item.price, settings);
  const priceTotal = helper.formatCurrency(item.price_total, settings);
  const discountTotal = helper.formatCurrency(item.discount_total, settings);
  const imageUrl = helper.getThumbnailUrl(item.image_url, 100);

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
            <MenuItem>{messages.edit}</MenuItem>
            <MenuItem onTouchTap={() => onItemDelete(item.id)}>{messages.actions_delete}</MenuItem>
          </IconMenu>
        </div>
      </div>
      <Divider />
    </div>
  )
}

const OrderItems = ({order, settings, onItemDelete}) => {
  const items = order.items.map((item, index) => <OrderItem key={index} item={item} settings={settings} onItemDelete={onItemDelete} />)
  return (
    <div>
      {items}
    </div>
  )
}

export default OrderItems;
