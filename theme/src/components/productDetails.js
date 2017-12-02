import React from 'react'
import { NavLink } from 'react-router-dom'
import ImageGallery from 'react-image-gallery'
import { themeSettings, text } from '../lib/settings'
import * as helper from '../lib/helper'
import Disqus from './disqus'
import ProductBreadcrumbs from './productBreadcrumbs'
import DiscountCountdown from './discountCountdown'
import CustomProductList from './customProductList'
import Lightbox from 'react-image-lightbox'
const Fragment = React.Fragment;

class ViewedProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewedProducts: []
    }
  }

  getArrayFromLocalStorage = () => {
    let values = [];
    let viewedProducts = localStorage.getItem("viewedProducts");

    try{
      if(viewedProducts && viewedProducts.length > 0){
        let viewedProductsParsed = JSON.parse(viewedProducts);
        if(Array.isArray(viewedProductsParsed)){
          values = viewedProductsParsed;
        }
      }
    } catch(e){};

    return values;
  }

  addProductIdToLocalStorage = productId => {
    if(productId && productId.length > 0){
      let viewedProducts = this.getArrayFromLocalStorage();

      if(viewedProducts.includes(productId)){
        const index = viewedProducts.indexOf(productId);
        viewedProducts.splice(index, 1);
        viewedProducts.push(productId);
      } else {
        viewedProducts.push(productId);
      }

      localStorage.setItem('viewedProducts', JSON.stringify(viewedProducts));
      this.setState({ viewedProducts: viewedProducts });
    }
  }

  componentDidMount() {
    const viewedProducts = this.getArrayFromLocalStorage();
    this.setState({ viewedProducts: viewedProducts });

    if(this.props.product && this.props.product.id){
      this.addProductIdToLocalStorage(this.props.product.id)
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.viewedProducts !== nextState.viewedProducts;
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.product !== nextProps.product && nextProps.product && nextProps.product.id){
      this.addProductIdToLocalStorage(nextProps.product.id)
    }
  }

  render() {
    const { limit, settings, addCartItem } = this.props;
    const { viewedProducts } = this.state;

    if(viewedProducts && viewedProducts.length > 0){
      const ids = viewedProducts.reverse().slice(0, limit);
      return (
        <section className="section section-product-related">
          <div className="container">
            <div className="title is-4 has-text-centered">{text.recentlyViewed}</div>
            <CustomProductList
              ids={ids}
              settings={settings}
              addCartItem={addCartItem}
              limit={limit}
              isCentered={true}
              columnCountOnMobile={2}
              columnCountOnDesktop={4}
            />
          </div>
        </section>
      )
    } else {
      return null;
    }
  }
}

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

const RelatedProducts = ({ ids, settings, addCartItem }) => {
  if(ids && ids.length > 0) {
    let title = themeSettings.related_products_title && themeSettings.related_products_title.length > 0
      ? themeSettings.related_products_title
      : text.relatedProducts;

    return (
      <section className="section section-product-related">
        <div className="container">
          <div className="title is-4 has-text-centered">{title}</div>
          <CustomProductList
            ids={ids}
            sort={null}
            limit={8}
            isCentered={true}
            settings={settings}
            addCartItem={addCartItem}
          />
        </div>
      </section>
    )
  } else {
    return null;
  }
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
        <div className="product-price">
          <span className="product-new-price">{helper.formatCurrency(variant.price, settings)}</span>
          <del className="product-old-price">{helper.formatCurrency(product.regular_price, settings)}</del>
        </div>
      )
    } else {
      return (
        <div className="product-price" style={priceStyle}>
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
      <div className="product-price" style={priceStyle}>
        {helper.formatCurrency(product.price, settings)}
      </div>
    )
  }
}

const AddToCartButton = ({ product, variant, addCartItem, isAllOptionsSelected }) => {
  let buttonStyle = {};
  if(themeSettings.button_addtocart_bg && themeSettings.button_addtocart_bg.length > 0){
    buttonStyle.backgroundColor = themeSettings.button_addtocart_bg;
  }
  if(themeSettings.button_addtocart_color && themeSettings.button_addtocart_color.length > 0){
    buttonStyle.color = themeSettings.button_addtocart_color;
  }

  let addToCartText = themeSettings.button_addtocart_text && themeSettings.button_addtocart_text.length > 0 ? themeSettings.button_addtocart_text : text.addToCart;

  if(product.variable && variant && variant.stock_quantity > 0) {
    return <button className="button is-success is-fullwidth" style={buttonStyle} onClick={addCartItem}>{addToCartText}</button>
  } else if(product.variable && !isAllOptionsSelected) {
    return <button className="button is-success is-fullwidth" style={buttonStyle} disabled>{text.optionsRequired}</button>
  } else if(product.variable) {
    return <button className="button is-success is-fullwidth" style={buttonStyle} disabled>{text.outOfStock}</button>
  } else if(product.stock_status === 'available') {
    return <button className="button is-success is-fullwidth" style={buttonStyle} onClick={addCartItem}>{addToCartText}</button>
  } else if(product.stock_status === 'out_of_stock') {
    return <button className="button is-success is-fullwidth" style={buttonStyle} disabled>{text.outOfStock}</button>
  } else if(product.stock_status === 'discontinued') {
    return <button className="button is-success is-fullwidth" style={buttonStyle} disabled>{text.discontinued}</button>
  } else {
    return null;
  }
}

const ProductDescription = ({ description }) => {
  return (
    <div dangerouslySetInnerHTML={{__html: description}}/>
  )
}

const ProductTags = ({ tags }) => {
  if(tags && tags.length > 0){
    return <div className="tags">
      {tags.map((tag, index) => (
        <span key={index} className="tag">{tag}</span>
      ))}
    </div>
  } else {
    return null;
  }
}

class ProductQuantity extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      quantity: 1
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.quantity > nextProps.maxQuantity){
      this.setQuantity(nextProps.maxQuantity);
    }
  }

  handleChange = (event) => {
    this.setQuantity(event.target.value);
  }

  setQuantity = (quantity) => {
    const intQuantity = parseInt(quantity);
    if(intQuantity > 0 && intQuantity <= this.props.maxQuantity){
      this.setState({ quantity: intQuantity });
      this.props.onChange(intQuantity);
    }
  }

  increment = () => {
    const newQuantity = this.state.quantity + 1;
    this.setQuantity(newQuantity);
  }

  decrement = () => {
    const newQuantity = this.state.quantity - 1;
    this.setQuantity(newQuantity);
  }

  render() {
    const { maxQuantity } = this.props;
    const { quantity } = this.state;
    const disabled = maxQuantity === 0;
    const value = disabled ? 0 : quantity;

    return (
      <Fragment>
        <div>{text.qty}</div>
        <div className="product-quantity">
          <a className="decrement" onClick={this.decrement}></a>
          <input value={value} onChange={this.handleChange} maxLength="3" type="number" pattern="\d*" disabled={disabled} />
          <a className="increment" onClick={this.increment}></a>
        </div>
      </Fragment>
    )
  }
}

class ProductGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lightboxIsOpen: false,
      lightboxPhotoIndex: 0
    }
  }

  openLightbox = () => {
    this.setState({ lightboxIsOpen: true });
  }

  closeLightbox = () => {
    this.setState({ lightboxIsOpen: false });
  }

  render() {
    const { images } = this.props;
    const { lightboxIsOpen, lightboxPhotoIndex } = this.state;

    if (images && images.length > 0) {
      const imagesArray = images.map(image => (
        {
          original: helper.getThumbnailUrl(image.url, themeSettings.bigThumbnailWidth),
          thumbnail: helper.getThumbnailUrl(image.url, themeSettings.previewThumbnailWidth),
          originalAlt: image.alt,
          thumbnailAlt: image.alt
        }
      ))

      const originalImages = images.map(image => image.url);
      const showThumbnails = images.length > 1;

      return (
        <div>
          <ImageGallery
            items={imagesArray}
            showThumbnails={showThumbnails}
            onClick={this.openLightbox}
            lazyLoad={true}
            slideInterval={2000}
            showNav={themeSettings.product_gallery_shownav || true}
            showBullets={showThumbnails}
            showPlayButton={false}
            showFullscreenButton={false}
            slideOnThumbnailHover={true}
            thumbnailPosition={themeSettings.product_thumbnail_position}
          />

          {lightboxIsOpen &&
              <Lightbox
                  reactModalStyle={{ overlay: { zIndex: 1099 } }}
                  mainSrc={originalImages[lightboxPhotoIndex]}
                  nextSrc={originalImages[(lightboxPhotoIndex + 1) % originalImages.length]}
                  prevSrc={originalImages[(lightboxPhotoIndex + originalImages.length - 1) % originalImages.length]}

                  onCloseRequest={this.closeLightbox}
                  onMovePrevRequest={() => this.setState({
                      lightboxPhotoIndex: (lightboxPhotoIndex + originalImages.length - 1) % originalImages.length,
                  })}
                  onMoveNextRequest={() => this.setState({
                      lightboxPhotoIndex: (lightboxPhotoIndex + 1) % originalImages.length,
                  })}
              />
          }

        </div>
      )
    } else {
      return <div className="large-image-placeholder"></div>;
    }
  }
}

export default class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOptions: {},
      selectedVariant: null,
      isAllOptionsSelected: false,
      quantity: 1
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

  setQuantity = (quantity) => {
    this.setState({ quantity: quantity });
  }

  addToCart() {
    const {product, addCartItem} = this.props;
    const {selectedVariant, quantity} = this.state;

    let item = {
      product_id: product.id,
      quantity: quantity
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
    const maxQuantity = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;

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
                    <ProductTags tags={product.tags} />
                    <h1 className="title is-4 product-name">{product.name}</h1>
                    <ProductPrice product={product} variant={selectedVariant} isAllOptionsSelected={isAllOptionsSelected} settings={settings} />

                    {themeSettings.show_discount_countdown && product.on_sale === true &&
                      <DiscountCountdown product={product} />
                    }

                    {product.options && product.options.length > 0 &&
                      <ProductOptions options={product.options} onChange={this.onOptionChange} />
                    }

                    <ProductQuantity maxQuantity={maxQuantity} onChange={this.setQuantity} />
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

          <RelatedProducts
            ids={product.related_product_ids}
            settings={settings}
            addCartItem={this.addToCart}
          />

          <ViewedProductList
            product={product}
            limit={4}
            settings={settings}
            addCartItem={this.addToCart}
          />

          {themeSettings.disqus_shortname && themeSettings.disqus_shortname !== '' &&
            <section className="section">
              <div className="container">
                <Disqus
                  shortname={themeSettings.disqus_shortname}
                  identifier={product.id}
                  title={product.name}
                  url={product.url}
                />
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
