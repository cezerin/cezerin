import React from 'react';
import { Link } from 'react-router-dom'
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import messages from 'lib/text'
import * as helper from 'lib/helper'
import style from './style.css'

const THUMBNAIL_WIDTH = 100;
const ImagePlaceholder = <FontIcon style={{fontSize: 30, color: '#cccccc'}} className="material-icons">photo_camera</FontIcon>;

const ItemImage = ({ images }) => {
  if(images && images.length > 0) {
    const imageUrl = helper.getThumbnailUrl(images[0].url, THUMBNAIL_WIDTH);
    return <img src={imageUrl} className={style.image} />
  } else {
    return ImagePlaceholder;
  }
}

const ItemPrice = ({ product, settings }) => {
  let priceFormatted = helper.formatCurrency(product.price, settings);
  let priceOldFormatted = product.on_sale ? helper.formatCurrency(product.regular_price, settings) : '';

  return (
    <div>
      <small>{priceOldFormatted}</small>
      {priceFormatted}
    </div>
  )
}

const ItemStock = ({ status, quantity }) => {
  let stockValue = "";
  let stockClass = "";
  switch(status) {
    case "discontinued":
      stockValue = messages.products_discontinued;
      stockClass = style.discontinued;
    break;
    case "backorder":
      stockValue = messages.products_backorder;
      stockClass = style.backorder;
    break;
    case "preorder":
      stockValue = messages.products_preorder;
      stockClass = style.preorder;
    break;
    case "available":
      stockValue = quantity;
      stockClass = style.inStock;
    break;
    case "out_of_stock":
    default:
      stockValue = messages.products_outOfStock;
      stockClass = style.outOfStock;
    break;
  }

  return (
    <div className={stockClass}>
      {stockValue}
    </div>
  )
}

const ProductItem = ({ product, onSelect, selected, settings }) => {
  let productClass = style.productName;
  if(!product.enabled || product.discontinued) {
    productClass += " " + style.productInactive;
  } else {
    productClass += " " + style.productActive;
  }

  const productName = product.name && product.name.length > 0 ? product.name : `<${messages.draft}>`;

  return (
    <div className={'products-item' + (selected === true ? ' selected' : '')}>
      <div className={"row row--no-gutter middle-xs " + style.innerItem}>
        <div className="col-xs-6 col--no-gutter">
          <div className="row row--no-gutter middle-xs">
            <div className="col-xs-1 col--no-gutter">
              <input type="checkbox" onChange={onSelect} checked={selected} value={product.id} />
            </div>
            <div className="col-xs-3">
              <div className={'row middle-xs center-xs ' + style.imageBox}>
                  <div className="col-xs-12">
                      <div className="box">
                        <ItemImage images={product.images} />
                      </div>
                  </div>
              </div>
            </div>
            <div className="col-xs-8">
              <Link to={'/admin/product/'+product.id} className={productClass}>
                {productName}<br /><small>{product.category_name}</small>
              </Link>
            </div>
          </div>
        </div>
        <div className={"col-xs-2 " + style.sku}>
          {product.sku}
        </div>
        <div className={"col-xs-2 " + style.stock}>
          <ItemStock status={product.stock_status} quantity={product.stock_quantity} />
        </div>
        <div className={"col-xs-2 " + style.price}>
          <ItemPrice product={product} settings={settings} />
        </div>
      </div>
      <Divider />
    </div>
  )
}

export default ProductItem;
