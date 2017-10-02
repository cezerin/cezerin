import api from './api'
import queryString from 'query-string'
import {getParsedProductFilter, getProductFilterForCategory, getProductFilterForSearch} from '../shared/actions'
import {PAGE, PRODUCT_CATEGORY, PRODUCT, RESERVED, SEARCH} from '../shared/pageTypes'

const getCurrentPage = path => {
  return api.sitemap.retrieve({ path: path, enabled: true })
    .then(sitemapResponse => {
      if(sitemapResponse.status === 200) {
        return sitemapResponse.json;
      } else if(sitemapResponse.status === 404) {
        return {
          type: 404,
          path: path,
          resource: null
        }
      } else {
        return Promise.reject(`Page response code = ${sitemapResponse.status}`)
      }
    })
}

const getProducts = (currentPage, productFilter) => {
  if (currentPage.type === PRODUCT_CATEGORY || currentPage.type === SEARCH) {
    const filter = getParsedProductFilter(productFilter);
    return api.products.list(filter).then(({status, json}) => json);
  } else {
    return null;
  }
}

const getProduct = currentPage => {
  if (currentPage.type === PRODUCT) {
    return api.products.retrieve(currentPage.resource).then(({status, json}) => json);
  } else {
    return {};
  }
}

const getPage = currentPage => {
  if (currentPage.type === PAGE) {
    return api.pages.retrieve(currentPage.resource).then(({status, json}) => json);
  } else {
    return {};
  }
}

const getThemeSettings = () => {
  const themeSettings = {
    "header_menu": [],
    "footer_about": "Store - just to show you what it can. Some text go here. Some text go here. Some text go here. Some text go here. Some text go here. Some text go here. Some text go here.",
    "footer_contacts": [
      "104 N Stagecoach Rd",
      "Dover Foxcroft, ME, 04426",
      "(207) 564-8482",
      "big-sales@shop.com"
    ],
    "footer_social": [
      { "type": "facebook", "url": "https://www.facebook.com/"},
      { "type": "twitter", "url": "https://twitter.com/"}
    ],
    "footer_menu_1_title": "Company",
    "footer_menu_1_items": [
      { "name": "About", "path": "/about"},
      { "name": "Blog", "path": "/blog"},
      { "name": "Terms of Service", "path": "/tos"},
      { "name": "Privacy Policy", "path": "/privacy-policy"}
    ],
    "footer_menu_2_title": "Customer service",
    "footer_menu_2_items": [
      { "name": "Shipping & returns", "path": "/about"},
      { "name": "Conditions of Use", "path": "/about"},
      { "name": "Sitemap", "path": "/about"}
    ],
    "home_slider": [
      {
        "image": "/assets/images/gallery/slide1.jpg",
        "title": "Slide 1 title",
        "description": "Some small text under slide 1 title",
        "path": "/",
        "button": "Shop now"
      },
      {
        "image": "/assets/images/gallery/slide2.jpg",
        "title": "Slide 2 title",
        "description": "Some small text under slide 2 title",
        "path": "/",
        "button": "Shop now"
      }
    ],
    "home_products_sku": "",
    "home_products_limit": 4,
    "home_products_sort": "-date_updated",
    "home_products_title": "BEST SELLERS",
    "show_product_filter": true,
    "cartThumbnailWidth": 100,
    "listThumbnailWidth": 340,
    "previewThumbnailWidth": 100,
    "bigThumbnailWidth": 800,
    "categoryThumbnailWidth": 800,
    "checkoutInputClass": "checkout-field",
    "checkoutButtonClass": "checkout-button button is-primary",
    "checkoutEditButtonClass": "checkout-button button",
    "sortNewest": "-date_created",
    "sortPriceLow": "price",
    "sortPriceHigh": "-price",
    "maxCartItemQty": 100,
    "show_product_breadcrumbs": true,
    "show_category_breadcrumbs": true,
    "show_discount_countdown": true,
    "product_thumbnail_position": "left",
    "disqus_shortname": "cezerin"
  }
  return Promise.resolve(themeSettings);
}

const getAllData = (currentPage, productFilter, cookie) => {
  return Promise.all([
    api.checkoutFields.list().then(({status, json}) => json),
    api.productCategories.list({enabled: true}).then(({status, json}) => json),
    api.ajax.cart.retrieve(cookie).then(({status, json}) => json),
    getProducts(currentPage, productFilter),
    getProduct(currentPage),
    getPage(currentPage),
    getThemeSettings()
  ])
  .then(([
    checkoutFields,
    categories,
    cart,
    products,
    product,
    page,
    themeSettings
  ]) => {
    let categoryDetails = null;
    if (currentPage.type === PRODUCT_CATEGORY) {
      categoryDetails = categories.find(c => c.id === currentPage.resource);
    }
    return {
      checkoutFields,
      categories,
      cart,
      products,
      product,
      page,
      categoryDetails,
      themeSettings
    }
  })
}

const getState = (currentPage, settings, allData, location, productFilter) => {
  const {
    checkoutFields,
    categories,
    cart,
    products,
    product,
    page,
    categoryDetails,
    themeSettings
  } = allData;

  let productsTotalCount = 0;
  let productsHasMore = false;
  let productsMinPrice = 0;
  let productsMaxPrice = 0;
  let productsAttributes = [];

  if(products){
    productsTotalCount = products.total_count;
    productsHasMore = products.has_more;
    productsAttributes = products.attributes;

    if(products.price) {
      productsMinPrice = products.price.min;
      productsMaxPrice = products.price.max;
    }
  }

  const state = { app: {
      settings: settings,
      location: location,
      currentPage: currentPage,
      pageDetails: page,
      categoryDetails: categoryDetails,
      productDetails: product,
      categories: categories,
      products: products && products.data ? products.data : [],
      productsTotalCount: productsTotalCount,
      productsHasMore: productsHasMore,
      productsMinPrice: productsMinPrice,
      productsMaxPrice: productsMaxPrice,
      productsAttributes: productsAttributes,
      paymentMethods: [],
      shippingMethods: [],
      loadingProducts: false,
      loadingMoreProducts: false,
      loadingShippingMethods: false,
      loadingPaymentMethods: false,
      processingCheckout: false,
      productFilter: {
        onSale: null,
        search: productFilter.search || '',
        categoryId: productFilter.categoryId,
        priceFrom: productFilter.priceFrom || 0,
        priceTo: productFilter.priceTo || 0,
        attributes: productFilter.attributes,
        sort: settings.default_product_sorting
      },
      cart: cart,
      order: null,
      checkoutFields: checkoutFields,
      themeSettings: themeSettings
    }
  }

  return state;
}

const getFilter = (currentPage, urlQuery, settings) => {
  let productFilter = {};

  if(currentPage.type === PRODUCT_CATEGORY){
    productFilter = getProductFilterForCategory(urlQuery);
    productFilter.categoryId = currentPage.resource;
    productFilter.sort = settings.default_product_sorting;
  } else if(currentPage.type === SEARCH){
    productFilter = getProductFilterForSearch(urlQuery);
  }

  return productFilter;
}

export const loadState = (req) => {
  const cookie = req.get('cookie');
  const urlPath = req.path;
  const urlQuery = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  const location = {
    hasHistory: false,
    pathname: urlPath,
    search: urlQuery,
    hash: ''
  }

  return Promise.all([
    getCurrentPage(req.path),
    api.settings.retrieve().then(({status, json}) => json)
  ])
  .then(([currentPage, settings]) => {
    const productFilter = getFilter(currentPage, urlQuery, settings);

    return getAllData(currentPage, productFilter, cookie)
    .then(allData => getState(currentPage, settings, allData, location, productFilter));
  })
}
