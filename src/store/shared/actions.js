import {push} from 'react-router-redux';
import * as t from './actionTypes'
import {PAGE, PRODUCT_CATEGORY, PRODUCT, RESERVED} from './pageTypes'
import clientSettings from '../client/settings'
import api from 'cezerin-client'
api.initAjax(clientSettings.ajaxBaseUrl);

export const fetchProduct = product_id => (dispatch, getState) => {
  dispatch(requestProduct())
  return api.ajax.products.retrieve(product_id).then(({status, json}) => {
    dispatch(receiveProduct(json))
  }).catch(error => {});
}

const requestProduct = () => ({type: t.PRODUCT_REQUEST})

const receiveProduct = product => ({type: t.PRODUCT_RECEIVE, product})

export const fetchProducts = () => (dispatch, getState) => {
  const {app} = getState();
  dispatch(requestProducts());

  let filter = app.productsFilter;
  filter.offset = 0;

  return api.ajax.products.list(filter).then(({status, json}) => {
    dispatch(receiveProducts(json))
    if(!app.products_min_price && !app.products_max_price) {
      dispatch(setProductsPriceRange(json.price.min, json.price.max));
    }
  }).catch(error => {});
}

const requestProducts = () => ({type: t.PRODUCTS_REQUEST})

const receiveProducts = (products) => ({type: t.PRODUCTS_RECEIVE, products})

export const fetchMoreProducts = () => (dispatch, getState) => {
  const {app} = getState();
  if (app.loadingProducts || app.loadingMoreProducts || app.products.length === 0 || !app.products_has_more) {
    return Promise.resolve();
  } else {
    dispatch(requestMoreProducts());

    let filter = app.productsFilter;
    //filter.limit = 15;
    filter.offset = app.products.length;

    return api.ajax.products.list(filter).then(({status, json}) => {
      dispatch(receiveMoreProducts(json))
    }).catch(error => {});
  }
}

const requestMoreProducts = () => ({type: t.MORE_PRODUCTS_REQUEST})

const receiveMoreProducts = products => ({type: t.MORE_PRODUCTS_RECEIVE, products})

export const fetchPage = pageId => (dispatch, getState) => {
  dispatch(requestPage());
  return api.ajax.pages.retrieve(pageId).then(({status, json}) => {
    dispatch(receivePage(json))
  }).catch(error => {});
}

const requestPage = () => ({type: t.PAGE_REQUEST})

const receivePage = pageDetails => ({type: t.PAGE_RECEIVE, pageDetails})

export const fetchCart = () => (dispatch, getState) => {
  dispatch(requestCart());
  return api.ajax.cart.retrieve().then(({status, json}) => {
    dispatch(receiveCart(json))
  }).catch(error => {});
}

const requestCart = () => ({type: t.CART_REQUEST})

const receiveCart = cart => ({type: t.CART_RECEIVE, cart})

export const addCartItem = item => (dispatch, getState) => {
  dispatch(requestAddCartItem())
  return api.ajax.cart.addItem(item).then(({status, json}) => {
    dispatch(receiveCart(json))
  }).catch(error => {});
}

const requestAddCartItem = () => ({type: t.CART_ITEM_ADD_REQUEST})

export const updateCartItemQuantiry = (item_id, quantity) => (dispatch, getState) => {
  dispatch(requestUpdateCartItemQuantiry())
  return api.ajax.cart.updateItem(item_id, {quantity: quantity}).then(({status, json}) => {
    dispatch(receiveCart(json))
    dispatch(fetchShippingMethods())
  }).catch(error => {});
}

const requestUpdateCartItemQuantiry = () => ({type: t.CART_ITEM_UPDATE_REQUEST})

export const deleteCartItem = item_id => (dispatch, getState) => {
  dispatch(requestDeleteCartItem())
  return api.ajax.cart.deleteItem(item_id).then(({status, json}) => {
    dispatch(receiveCart(json))
    dispatch(fetchShippingMethods())
  }).catch(error => {});
}

const requestDeleteCartItem = () => ({type: t.CART_ITEM_DELETE_REQUEST})

export const fetchPaymentMethods = () => (dispatch, getState) => {
  dispatch(requestPaymentMethods())
  return api.ajax.payment_methods.list().then(({status, json}) => {
    dispatch(receivePaymentMethods(json))
  }).catch(error => {});
}

const requestPaymentMethods = () => ({type: t.PAYMENT_METHODS_REQUEST})

const receivePaymentMethods = methods => ({type: t.PAYMENT_METHODS_RECEIVE, methods})

export const fetchShippingMethods = () => (dispatch, getState) => {
  dispatch(requestShippingMethods())
  return api.ajax.shipping_methods.list().then(({status, json}) => {
    dispatch(receiveShippingMethods(json))
  }).catch(error => {});
}

const requestShippingMethods = () => ({type: t.SHIPPING_METHODS_REQUEST})

const receiveShippingMethods = methods => {
  type : t.SHIPPING_METHODS_RECEIVE,
  methods
}

export const checkout = cart => (dispatch, getState) => {
  dispatch(requestCheckout())
  return [
    api.ajax.cart.updateShippingAddress(cart.shipping_address),
    api.ajax.cart.updateBillingAddress(cart.billing_address),
    api.ajax.cart.update({
      email: cart.email, mobile: cart.mobile, payment_method_id: cart.payment_method_id, shipping_method_id: cart.shipping_method_id, draft: false
      // coupon: cart.coupon
    }),
    api.ajax.cart.checkout()
  ].reduce((p, fn) => p.then(() => fn), Promise.resolve()).then(({status, json}) => {
    dispatch(receiveCheckout(json))
    dispatch(push('/checkout-success'));
  }).catch(error => {});
}

const requestCheckout = () => ({type: t.CHECKOUT_REQUEST})

const receiveCheckout = order => ({type: t.CHECKOUT_RECEIVE, order})

export const receiveSitemap = currentPage => ({type: t.SITEMAP_RECEIVE, currentPage})

export const setCategory = category_id => (dispatch, getState) => {
  const {app} = getState();
  const category = app.categories.find(c => c.id === category_id);
  if (category) {
    dispatch(setCurrentCategory(category));
    dispatch(setProductsPriceRange(null, null));
    dispatch(clearProductsFilter());
    dispatch(setProductsFilter({category_id: category_id}));
    dispatch(receiveProduct(null));
  }
}

const setCurrentCategory = category => ({type: t.SET_CURRENT_CATEGORY, category})

export const setSearch = search => (dispatch, getState) => {
  dispatch(setProductsFilter({search: search, category_id: null}));
  dispatch(fetchProducts());
}

export const setSort = sort => (dispatch, getState) => {
  dispatch(setProductsFilter({sort: sort}));
  dispatch(fetchProducts());
}

export const setPriceFromAndTo = (price_from, price_to) => (dispatch, getState) => {
  if(price_to > 0) {
    dispatch(setProductsFilter({price_from: price_from, price_to: price_to}));
    dispatch(fetchProducts());
  }
}

export const setPriceFrom = price_from => (dispatch, getState) => {
  dispatch(setProductsFilter({price_from: price_from}));
  dispatch(fetchProducts());
}

export const setPriceTo = price_to => (dispatch, getState) => {
  if(price_to > 0) {
    dispatch(setProductsFilter({price_to: price_to}));
    dispatch(fetchProducts());
  }
}

const setProductsPriceRange = (min, max) => ({type: t.SET_PRODUCTS_PRICE_RANGE, min, max})

const setProductsFilter = filter => ({type: t.SET_PRODUCTS_FILTER, filter: filter})

const EMPTY_FILTER = { on_sale: null, search: '', price_from: 0, price_to: 0 };
const clearProductsFilter = () => ({type: t.SET_PRODUCTS_FILTER, filter: EMPTY_FILTER});

export const updateCartShippingCountry = country => (dispatch, getState) => {
  return [
    api.ajax.cart.updateShippingAddress({country: country}),
    api.ajax.cart.update({payment_method_id: null, shipping_method_id: null})
  ].reduce((p, fn) => p.then(() => fn), Promise.resolve()).then(({status, json}) => {
    dispatch(receiveCart(json))
    dispatch(fetchShippingMethods())
    dispatch(fetchPaymentMethods())
  }).catch(error => {});
}

export const updateCartShippingState = state => (dispatch, getState) => {
  return [
    api.ajax.cart.updateShippingAddress({state: state}),
    api.ajax.cart.update({payment_method_id: null, shipping_method_id: null})
  ].reduce((p, fn) => p.then(() => fn), Promise.resolve()).then(({status, json}) => {
    dispatch(receiveCart(json))
    dispatch(fetchShippingMethods())
    dispatch(fetchPaymentMethods())
  }).catch(error => {});
}

export const updateCartShippingCity = city => (dispatch, getState) => {
  return [
    api.ajax.cart.updateShippingAddress({city: city}),
    api.ajax.cart.update({payment_method_id: null, shipping_method_id: null})
  ].reduce((p, fn) => p.then(() => fn), Promise.resolve()).then(({status, json}) => {
    dispatch(receiveCart(json))
    dispatch(fetchShippingMethods())
    dispatch(fetchPaymentMethods())
  }).catch(error => {});
}

export const updateCartShippingMethod = method_id => (dispatch, getState) => {
  api.ajax.cart.update({payment_method_id: null, shipping_method_id: method_id}).then(({status, json}) => {
    dispatch(receiveCart(json))
    dispatch(fetchPaymentMethods())
  }).catch(error => {});
}

export const updateCartPaymentMethod = method_id => (dispatch, getState) => {
  api.ajax.cart.update({payment_method_id: method_id}).then(({status, json}) => {
    dispatch(receiveCart(json))
  }).catch(error => {});
}

export const updateCart = cart => (dispatch, getState) => {
  return [
    api.ajax.cart.updateShippingAddress(cart.shipping_address),
    api.ajax.cart.updateBillingAddress(cart.billing_address),
    api.ajax.cart.update({
      email: cart.email, mobile: cart.mobile, payment_method_id: cart.payment_method_id, shipping_method_id: cart.shipping_method_id
      // coupon: cart.coupon
    })
  ].reduce((p, fn) => p.then(() => fn), Promise.resolve()).then(({status, json}) => {
    dispatch(receiveCart(json))
    dispatch(fetchShippingMethods())
    dispatch(fetchPaymentMethods())
  }).catch(error => {});
}

const getCategories = () => {
  return api.ajax.product_categories.list({enabled: true}).then(({status, json}) => json)
}

const getProducts = (currentPage, filter) => {
  if (currentPage.type === PRODUCT_CATEGORY) {
    return api.ajax.products.list(filter).then(({status, json}) => json)
  } else {
    return Promise.resolve([]);
  }
}

const getProduct = currentPage => {
  if (currentPage.type === PRODUCT) {
    return api.ajax.products.retrieve(currentPage.resource).then(({status, json}) => json)
  } else {
    return Promise.resolve();
  }
}

const getCart = cookie => {
  return api.ajax.cart.retrieve(cookie).then(({status, json}) => json)
}

const getPage = currentPage => {
  if (currentPage.type === PAGE) {
    return api.ajax.pages.retrieve(currentPage.resource).then(pageResponse => {
      return pageResponse.json;
    })
  } else {
    return Promise.resolve({});
  }
}

const getCommonData = (req, currentPage, productsFilter) => {
  const cookie = req.get('cookie');
  return Promise.all([getCategories(), getProduct(currentPage), getProducts(currentPage, productsFilter), getCart(cookie), getPage(currentPage)]).then(([categories, product, products, cart, pageDetails]) => {
    let categoryDetails = null;
    if (currentPage.type === PRODUCT_CATEGORY) {
      categoryDetails = categories.find(c => c.id === currentPage.resource);
    }
    return {
      categories,
      product,
      products,
      categoryDetails,
      cart,
      pageDetails
    }
  });
}

export const getInitialState = (req, checkoutFields, currentPage, settings) => {
  let initialState = {
    app: {
      settings: settings,
      currentPage: currentPage,
      pageDetails: {},
      categoryDetails: null,
      productDetails: null,
      categories: [],
      products: [],
      products_total_count: 0,
      products_has_more: false,
      products_min_price: 0,
      products_max_price: 0,
      paymentMethods: [],
      shippingMethods: [],
      loadingProducts: false,
      loadingMoreProducts: false,
      loadingShippingMethods: false,
      loadingPaymentMethods: false,
      processingCheckout: false,
      productsFilter: {
        on_sale: null,
        search: '',
        category_id: null,
        price_from: 0,
        price_to: 0,
        limit: 30,
        sort: settings.default_product_sorting,
        fields: 'path,id,name,category_id,category_name,sku,images,enabled,discontinued,stock_status,stock_quantity,price,on_sale,regular_price'
      },
      cart: null,
      order: null,
      checkoutFields: checkoutFields
    }
  }

  if (currentPage.type === PRODUCT_CATEGORY) {
    initialState.app.productsFilter.category_id = currentPage.resource;
  }

  return getCommonData(req, currentPage, initialState.app.productsFilter).then(commonData => {
    initialState.app.categories = commonData.categories;
    initialState.app.productDetails = commonData.product;
    if(commonData.products) {
      initialState.app.products = commonData.products.data;
      initialState.app.products_total_count = commonData.products.total_count;
      initialState.app.products_has_more = commonData.products.has_more;
      if(commonData.products.price) {
        initialState.app.products_min_price = commonData.products.price.min;
        initialState.app.products_max_price = commonData.products.price.max;
      }
    }
    initialState.app.categoryDetails = commonData.categoryDetails;
    initialState.app.cart = commonData.cart;
    initialState.app.pageDetails = commonData.pageDetails;
    return initialState;
  })

}
