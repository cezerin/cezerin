import React from 'react'
import { NavLink } from 'react-router-dom'
import ImageGallery from 'react-image-gallery'
import { themeSettings, text } from '../lib/settings'
import * as helper from '../lib/helper'
import Disqus from './disqus'
import ProductBreadcrumbs from './productBreadcrumbs'
import DiscountCountdown from './discountCountdown'

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
    <div className="columns is-gapless is-mobile product-attribute" key={index}>
      <div className="column is-5 attribute-name">
        {attribute.name}:
      </div>
      <div className="column is-7 attribute-value">
        {attribute.value}
      </div>
    </div>
  )

  return (
    <div className="product-attributes">
      <div className="title is-5">{text.attributes}</div>
      {items}
    </div>
  )
}

const ProductPrice = ({ product, variant, isAllOptionsSelected, settings }) => {
  if(product.variable && variant) {
    if(product.on_sale){
      return (
        <div className="product-price">
          <span className="product-new-price">{helper.formatCurrency(variant.price, settings)}</span>
          <del className="product-old-price">{helper.formatCurrency(product.regular_price, settings)}</del>
        </div>
      )
    } else {
      return (
        <div className="product-price">
          {helper.formatCurrency(variant.price, settings)}
        </div>
      )
    }
  } else if(product.on_sale) {
    return (
      <div className="product-price">
        <span className="product-new-price">{helper.formatCurrency(product.price, settings)}</span>
        <del className="product-old-price">{helper.formatCurrency(product.regular_price, settings)}</del>
      </div>
    )
  } else {
    return (
      <div className="product-price">
        {helper.formatCurrency(product.price, settings)}
      </div>
    )
  }
}

const AddToCartButton = ({ product, variant, addCartItem, isAllOptionsSelected }) => {
  if(product.variable && variant && variant.stock_quantity > 0) {
    return <button className="button is-success is-fullwidth" onClick={addCartItem}>{text.addToCart}</button>
  } else if(product.variable && !isAllOptionsSelected) {
    return <button className="button is-success is-fullwidth" disabled>{text.optionsRequired}</button>
  } else if(product.variable) {
    return <button className="button is-success is-fullwidth" disabled>{text.outOfStock}</button>
  } else if(product.stock_status === 'available') {
    return <button className="button is-success is-fullwidth" onClick={addCartItem}>{text.addToCart}</button>
  } else if(product.stock_status === 'out_of_stock') {
    return <button className="button is-success is-fullwidth" disabled>{text.outOfStock}</button>
  } else if(product.stock_status === 'discontinued') {
    return <button className="button is-success is-fullwidth" disabled>{text.discontinued}</button>
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
  if (images && images.length > 0) {
    const imagesArray = images.map(image => (
      {
        original: helper.getThumbnailUrl(image.url, themeSettings.bigThumbnailWidth),
        thumbnail: helper.getThumbnailUrl(image.url, themeSettings.previewThumbnailWidth),
        originalAlt: image.alt,
        thumbnailAlt: image.alt
      }
    ))

    const showThumbnails = images.length > 1;

    return (
      <ImageGallery
        items={imagesArray}
        showThumbnails={showThumbnails}
        lazyLoad={false}
        slideInterval={2000}
        showNav={false}
        showBullets={showThumbnails}
        showPlayButton={false}
        showFullscreenButton={false}
        slideOnThumbnailHover={true}
        thumbnailPosition={themeSettings.product_thumbnail_position}
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
    const {product, settings, categories} = this.props;
    const {selectedVariant, isAllOptionsSelected} = this.state;

    if(product){
      return (
        <div>
          <section className="section section-product">
            <div className="container">
              <div className="columns">
                <div className="column is-7">
                  {themeSettings.show_product_breadcrumbs &&
                    <ProductBreadcrumbs product={product} categories={categories} />
                  }
                  <ProductGallery images={product.images} />
                </div>
                <div className="column is-5">
                  <div className="content">
                    <h1 className="title is-4 product-name">{product.name}</h1>
                    <ProductPrice product={product} variant={selectedVariant} isAllOptionsSelected={isAllOptionsSelected} settings={settings} />

                    {themeSettings.show_discount_countdown && product.on_sale === true &&
                      <DiscountCountdown product={product} />
                    }

                    {product.options && product.options.length > 0 &&
                      <ProductOptions options={product.options} onChange={this.onOptionChange} />
                    }

                    <div className="button-addtocart">
                      <AddToCartButton product={product} variant={selectedVariant} addCartItem={this.addToCart} isAllOptionsSelected={isAllOptionsSelected} />
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </section>


          <section className="section section-product-description">
            <div className="container">
              <div className="content">
                <div className="columns">
                  <div className="column is-7">
                    <ProductDescription description={product.description} />
                  </div>
                  <div className="column is-5">
                    {product.attributes && product.attributes.length > 0 &&
                      <ProductAttributes attributes={product.attributes} />
                    }
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* {product.related_product_ids && product.related_product_ids.length > 0 &&
            <section className="section section-product-related">
              <RelatedProducts ids={product.related_product_ids} />
            </section>
          } */}

          {themeSettings.disqus_shortname !== '' &&
            <section className="section">
              <div className="container">
                <div className="columns">
                  <div className="column is-7">
                    <Disqus
                      shortname={themeSettings.disqus_shortname}
                      identifier={product.id}
                      title={product.name}
                      url={product.url}
                    />
                  </div>
                </div>
              </div>
            </section>
          }

        </div>
      )
    } else {
      return null;
    }
  }
}
