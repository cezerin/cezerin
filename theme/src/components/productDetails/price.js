import React from 'react'
import * as helper from '../../lib/helper'
import { themeSettings, text } from '../../lib/settings'

const FormattedCurrency = ({ number, settings }) => (helper.formatCurrency(number, settings))

const NewAndOldPrices = ({ newPrice, oldPrice, settings }) => (
  <div className="product-price">
    <span className="product-new-price">
      <FormattedCurrency settings={settings} number={newPrice} />
    </span>
    <del className="product-old-price">
      <FormattedCurrency settings={settings} number={oldPrice} />
    </del>
  </div>
)

const Price = ({ product, variant, isAllOptionsSelected, settings }) => {
  let priceStyle = {};
  if(themeSettings.details_price_size && themeSettings.details_price_size > 0){
    priceStyle.fontSize = themeSettings.details_price_size + 'px';
  }
  if(themeSettings.details_price_color && themeSettings.details_price_color.length > 0){
    priceStyle.color = themeSettings.details_price_color;
  }

  if(product.variable && variant) {
    if(product.on_sale){
      return (
        <NewAndOldPrices settings={settings} newPrice={variant.price} oldPrice={product.regular_price} />
      )
    } else {
      return (
        <div className="product-price" style={priceStyle}>
          <FormattedCurrency settings={settings} number={variant.price} />
        </div>
      )
    }
  } else if(product.on_sale) {
    return (
      <NewAndOldPrices settings={settings} newPrice={product.price} oldPrice={product.regular_price} />
    )
  } else {
    return (
      <div className="product-price" style={priceStyle}>
        <FormattedCurrency settings={settings} number={product.price} />
      </div>
    )
  }
}

export default Price;
