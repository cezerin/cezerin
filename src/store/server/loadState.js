import api from 'cezerin-client'
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
    return api.ajax.products.list(filter).then(({status, json}) => json);
  } else {
    return null;
  }
}

const getProduct = currentPage => {
  if (currentPage.type === PRODUCT) {
    return api.ajax.products.retrieve(currentPage.resource).then(({status, json}) => json);
  } else {
    return {};
  }
}

const getPage = currentPage => {
  if (currentPage.type === PAGE) {
    return api.ajax.pages.retrieve(currentPage.resource).then(({status, json}) => json);
  } else {
    return {};
  }
}

const getAllData = (currentPage, productFilter, cookie) => {
  return Promise.all([
    api.checkoutFields.list().then(({status, json}) => json),
    api.productCategories.list({enabled: true}).then(({status, json}) => json),
    api.ajax.cart.retrieve(cookie).then(({status, json}) => json),
    getProducts(currentPage, productFilter),
    getProduct(currentPage),
    getPage(currentPage)
  ])
  .then(([
    checkoutFields,
    categories,
    cart,
    products,
    product,
    page
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
      categoryDetails
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
    categoryDetails
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
      checkoutFields: checkoutFields
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
