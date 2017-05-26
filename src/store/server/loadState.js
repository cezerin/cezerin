import api from 'cezerin-client'
import {getProductFilter} from '../shared/actions'
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
  if (currentPage.type === PRODUCT_CATEGORY) {
    const filter = getProductFilter(productFilter);
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

const getState = (currentPage, settings, allData) => {
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

  if(products){
    productsTotalCount = products.total_count;
    productsHasMore = products.has_more;

    if(products.price) {
      productsMinPrice = products.price.min;
      productsMaxPrice = products.price.max;
    }
  }

  const state = { app: {
      settings: settings,
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
      paymentMethods: [],
      shippingMethods: [],
      loadingProducts: false,
      loadingMoreProducts: false,
      loadingShippingMethods: false,
      loadingPaymentMethods: false,
      processingCheckout: false,
      productFilter: {
        onSale: null,
        search: '',
        categoryId: currentPage.type === PRODUCT_CATEGORY ? currentPage.resource : null,
        priceFrom: 0,
        priceTo: 0,
        sort: settings.default_product_sorting
      },
      cart: cart,
      order: null,
      checkoutFields: checkoutFields
    }
  }

  return state;
}

export const loadState = (req) => {
  const cookie = req.get('cookie');
  let currentPage = null;
  let settings = null;
  return getCurrentPage(req.path)
    .then(page => {
      currentPage = page;
      return api.settings.retrieve()
    })
    .then(settingsResponse => {
      settings = settingsResponse.json;
      const productFilter = {
        categoryId: currentPage.type === PRODUCT_CATEGORY ? currentPage.resource : null,
        sort: settings.default_product_sorting
      };
      return getAllData(currentPage, productFilter, cookie);
    })
    .then(allData => getState(currentPage, settings, allData));
}
