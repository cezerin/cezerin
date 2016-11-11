import React from 'react';
import { Link } from 'react-router'
import Checkbox from 'material-ui/Checkbox';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import messages from 'src/locale'
import settings from 'lib/settings'
import style from './style.css'

export default ({ product, onSelect, selected }) => {
  let image = <div className={style.placeholder}><FontIcon style={{fontSize: 30, color: '#cccccc'}} className="material-icons">photo_camera</FontIcon></div>;
  if(product.images && product.images.length > 0) {
    image = <img src={product.images[0].url} className={style.image} />;
  }

  const checked = selected.includes(product.id);

  let productClass = style.productName;
  if(!product.active || product.discontinued) {
    productClass += " " + style.productInactive;
  } else {
    productClass += " " + style.productActive;
  }

  let stockValue = "";
  let stockClass = "";
  switch(product.stock_status) {
    case "discontinued":
      stockValue = messages.products.discontinued;
      stockClass = style.discontinued;
    break;
    case "backorder":
      stockValue = messages.products.backorder;
      stockClass = style.backorder;
    break;
    case "preorder":
      stockValue = messages.products.preorder;
      stockClass = style.preorder;
    break;
    case "available":
      //messages.products.inStock
      stockValue = product.stock_quantity;
      stockClass = style.inStock;
    break;
    case "out_of_stock":
    default:
      stockValue = messages.products.outOfStock;
      stockClass = style.outOfStock;
    break;
  }

  let priceFormatted = "";
  if(product.price && product.price > 0 && product.currency && product.currency !== '') {
    priceFormatted = product.price.toLocaleString(settings.lenguage, { style: 'currency', currency: product.currency });
  }

  let priceOldFormatted = "";
  if(product.on_sale && product.regular_price && product.regular_price > 0 && product.currency && product.currency !== '') {
    priceOldFormatted = product.regular_price.toLocaleString(settings.lenguage, { style: 'currency', currency: product.currency });
    priceOldFormatted = <small>{priceOldFormatted}</small>;
  }


  return (
    <div>
      <ListItem
        onTouchTap={()=>{}}
        style={{ cursor: 'normal' }}
        innerDivStyle={{paddingTop: '0px', paddingBottom: '0px'}}
        primaryText={
          <div className="row row--no-gutter middle-xs">
            <div className="col-xs-6 col--no-gutter">
              <div className="row row--no-gutter middle-xs">
                <div className="col-xs-1 col--no-gutter">
                  <Checkbox checked={checked} onCheck={(event, isInputChecked) => { onSelect(product.id, isInputChecked); }} />
                </div>
                <div className="col-xs-3">
                  {image}
                </div>
                <div className="col-xs-8">
                  <Link to={'/admin/product/'+product.id} className={productClass}>
                    {product.name}<br /><small>{product.category_name}</small>
                  </Link>
                </div>
              </div>
            </div>
            <div className={"col-xs-2 " + style.sku}>
              {product.sku}
            </div>
            <div className={"col-xs-2 " + style.stock + " "+ stockClass}>
              {stockValue}
            </div>
            <div className={"col-xs-2 " + style.price}>
              {priceOldFormatted}
              {priceFormatted}
            </div>
          </div>
        }
      />
      <Divider />
    </div>
  )
}
