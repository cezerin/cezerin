import React from 'react'
import { NavLink } from 'react-router-dom'
import ImageGallery from 'react-image-gallery'
import text from '../lib/text'
import config from '../lib/config'
import * as helper from '../lib/helper'

const ProductOption = ({ option, onChange }) => {
  const values = option.values
    .sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
    .map((value, index) => (
    <option key={index} value={value.id}>{value.name}</option>
  ))

  const notSelectedTitle = `${text.selectOption} ${option.name}`;

  return (
    <div className="product-option">
      <div className="product-option-name">{option.name}</div>
      <span className="select is-fullwidth">
        <select onChange={e => {onChange(option.id, e.target.value)}}>
          <option value="">{notSelectedTitle}</option>
          {values}
        </select>
      </span>
    </div>
  );
}

const ProductOptions = ({ options, onChange }) => {
  const items = options.map((option, index) => (
    <ProductOption key={index} option={option} onChange={onChange} />
  ))

  return (
    <div className="product-options">
      {items}
    </div>
  )
}

const RelatedProducts = ({ ids }) => {
  return (
    <div className="container">
      <div className="title is-4">{text.relatedProducts}</div>
      <div>Not implemented</div>
    </div>
  );
}

const ProductAttributes = ({ attributes }) => {
  const items = attributes.map((attribute, index) =>
    <div key={index} className="product-attribute">{attribute.name}: {attribute.value}</div>
  )

  return (
    <div className="product-attributes">
      {items}
    </div>
  )
}

const ProductPrice = ({ product, variant, isAllOptionsSelected, settings }) => {
  if(product.variable && variant) {
    return (
      <div className="subtitle is-5">
        {helper.formatCurrency(variant.price, settings)}
      </div>
    )
  } else if(product.on_sale) {
    return (
      <div className="title is-5">
        <del className="product-old-price">{helper.formatCurrency(product.regular_price, settings)}</del>
        <span className="product-new-price">{helper.formatCurrency(product.price, settings)}</span>
      </div>
    )
  } else {
    return (
      <div className="subtitle is-5">
        {helper.formatCurrency(product.price, settings)}
      </div>
    )
  }
}

const AddToCartButton = ({ product, variant, addCartItem, isAllOptionsSelected }) => {
  if(product.variable && variant && variant.stock_quantity > 0) {
    return <button className="button is-dark is-fullwidth" onClick={addCartItem}>{text.addToCart}</button>
  } else if(product.variable && !isAllOptionsSelected) {
    return <button className="button is-dark is-fullwidth" disabled>{text.optionsRequired}</button>
  } else if(product.variable) {
    return <button className="button is-dark is-fullwidth" disabled>{text.outOfStock}</button>
  } else if(product.stock_status === 'available') {
    return <button className="button is-dark is-fullwidth" onClick={addCartItem}>{text.addToCart}</button>
  } else if(product.stock_status === 'out_of_stock') {
    return <button className="button is-dark is-fullwidth" disabled>{text.outOfStock}</button>
  } else if(product.stock_status === 'discontinued') {
    return <button className="button is-dark is-fullwidth" disabled>{text.discontinued}</button>
  } else {
    return null;
  }
}

const ProductDescription = ({ description }) => {
  return (
    <div dangerouslySetInnerHTML={{__html: description}}/>
  )
}

const ProductGallery = ({ images }) => {
  if (images.length > 0) {
    const imagesArray = images.map(image => (
      {
        original: helper.getThumbnailUrl(image.url, config.big_thumbnail_width),
        thumbnail: helper.getThumbnailUrl(image.url, config.preview_thumbnail_width),
        originalAlt: image.alt,
        thumbnailAlt: image.alt
      }
    ))

    const showThumbnails = images.length > 1;

    return (
      <ImageGallery
        items={imagesArray}
        showThumbnails={showThumbnails}
        slideInterval={2000}
        lazyLoad={true}
        showNav={false}
        showPlayButton={false}
        showFullscreenButton={false}
        thumbnailPosition="bottom"
      />
    )

  } else {
    return <div className="large-image-placeholder"></div>;
  }
}

export default class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOptions: {},
      selectedVariant: null,
      isAllOptionsSelected: false
    }

    this.onOptionChange = this.onOptionChange.bind(this);
    this.findVariantBySelectedOptions = this.findVariantBySelectedOptions.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.checkSelectedOptions = this.checkSelectedOptions.bind(this);
  }

  onOptionChange(optionId, valueId) {
    let {selectedOptions} = this.state;

    if(valueId === '') {
      delete selectedOptions[optionId];
    } else {
      selectedOptions[optionId] = valueId;
    }

    this.setState({ selectedOptions: selectedOptions });
    this.findVariantBySelectedOptions();
    this.checkSelectedOptions();
  }

  findVariantBySelectedOptions() {
    const {selectedOptions} = this.state;
    const {product} = this.props;
    for(const variant of product.variants) {
      const variantMutchSelectedOptions = variant.options.every(variantOption => selectedOptions[variantOption.option_id] === variantOption.value_id);
      if(variantMutchSelectedOptions) {
        this.setState({ selectedVariant: variant });
        return;
      }
    }

    this.setState({ selectedVariant: null });
  }


  addToCart() {
    const {product, addCartItem} = this.props;
    const {selectedVariant} = this.state;

    let item = {
      product_id: product.id,
      quantity: 1
    }

    if(selectedVariant) {
      item.variant_id = selectedVariant.id;
    }

    addCartItem(item);
  }

  checkSelectedOptions() {
    const {selectedOptions} = this.state;
    const {product} = this.props;

    const allOptionsSelected = Object.keys(selectedOptions).length === product.options.length;
    this.setState({ isAllOptionsSelected: allOptionsSelected });
  }

  render() {
    const {product, settings} = this.props;
    const {selectedVariant, isAllOptionsSelected} = this.state;

    return (
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-6">
              <ProductGallery images={product.images} />
            </div>
            <div className="column is-5 is-offset-1">
              <div className="content">

                <h1 className="title is-4">{product.name}</h1>

                <ProductPrice product={product} variant={selectedVariant} isAllOptionsSelected={isAllOptionsSelected} settings={settings} />

                {product.options && product.options.length > 0 &&
                  <ProductOptions options={product.options} onChange={this.onOptionChange} />
                }

                <div className="columns">
                  <div className="column is-6">
                    <AddToCartButton product={product} variant={selectedVariant} addCartItem={this.addToCart} isAllOptionsSelected={isAllOptionsSelected} />
                  </div>
                </div>

                {product.attributes && product.attributes.length > 0 &&
                  <ProductAttributes attributes={product.attributes} />
                }

              </div>
            </div>
          </div>
          <div className="content">
            <ProductDescription description={product.description} />
          </div>
        </div>
        {product.related_product_ids && product.related_product_ids.length > 0 &&
          <RelatedProducts ids={product.related_product_ids} />
        }
      </section>
    )
  }
}
