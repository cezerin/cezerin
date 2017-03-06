import React from 'react';
import { Link } from 'react-router'
import Checkbox from 'material-ui/Checkbox';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import messages from 'lib/text'
import helper from 'lib/helper'
import style from './style.css'

const ImagePlaceholder = <div className={style.placeholder}><FontIcon style={{fontSize: 30, color: '#cccccc'}} className="material-icons">photo_camera</FontIcon></div>;

const ProductItem = ({ product, onSelect, selected, settings }) => {
  let image = null;
  if(product.images && product.images.length > 0) {
    image = <img src={product.images[0].url} className={style.image} />;
  } else {
    image = ImagePlaceholder;
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
      stockValue = product.stock_quantity;
      stockClass = style.inStock;
    break;
    case "out_of_stock":
    default:
      stockValue = messages.products.outOfStock;
      stockClass = style.outOfStock;
    break;
  }

  let priceFormatted = helper.formatCurrency(product.price, settings);
  let priceOldFormatted = product.on_sale ? helper.formatCurrency(product.regular_price, settings) : '';

  return (
    <div>
      <ListItem style={{ cursor: 'normal' }}
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
              <small>{priceOldFormatted}</small>
              {priceFormatted}
            </div>
          </div>
        }
      />
      <Divider />
    </div>
  )
}

export default ProductItem;
