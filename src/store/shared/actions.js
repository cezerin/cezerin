import { push } from 'react-router-redux';
import * as t from './actionTypes'
import clientSettings from '../client/settings'
import api from 'cezerin-client'
api.initAjax(clientSettings.ajaxBaseUrl);

function receivePage(page) {
  return {type: t.PAGE_RECEIVE, page}
}

function receiveProducts(products) {
  return {type: t.PRODUCTS_RECEIVE, products}
}

function receiveProduct(product) {
  return {type: t.PRODUCT_RECEIVE, product}
}

function receiveCategories(categories) {
  return {type: t.CATEGORIES_RECEIVE, categories}
}

export function receiveSitemap(currentPage) {
  return {type: t.SITEMAP_RECEIVE, currentPage}
}

function setCurrentCategory(category) {
  return {type: t.SET_CURRENT_CATEGORY, category}
}

function resetCurrentCategory() {
  return {type: t.SET_CURRENT_CATEGORY, category: null}
}

function receiveCart(cart) {
  return {type: t.CART_RECEIVE, cart}
}

function receivePaymentMethods(methods) {
  return {type: t.PAYMENT_METHODS_RECEIVE, methods}
}

function requestPaymentMethods() {
  return {type: t.PAYMENT_METHODS_REQUEST}
}

function receiveShippingMethods(methods) {
  return {type: t.SHIPPING_METHODS_RECEIVE, methods}
}

function requestShippingMethods() {
  return {type: t.SHIPPING_METHODS_REQUEST}
}

function receiveCheckout(order) {
  return {type: t.CHECKOUT_RECEIVE, order}
}

function requestCheckout() {
  return {type: t.CHECKOUT_REQUEST}
}

export function setCategory(category_id) {
  return (dispatch, getState) => {
    const state = getState();
    const category = state.app.categories.find(c => c.id === category_id);
    dispatch(setCurrentCategory(category));
    dispatch(fetchProducts());
    dispatch(receiveProduct(null))
  }
}

export function fetchShippingMethods() {
  return (dispatch, getState) => {
    dispatch(requestShippingMethods())
    return api.ajax.shipping_methods.list().then(({status, json}) => {
      dispatch(receiveShippingMethods(json))
    }).catch(error => {});
  }
}

export function fetchPaymentMethods() {
  return (dispatch, getState) => {
    dispatch(requestPaymentMethods())
    return api.ajax.payment_methods.list().then(({status, json}) => {
      dispatch(receivePaymentMethods(json))
    }).catch(error => {});
  }
}

export function fetchCart() {
  return (dispatch, getState) => {
    return api.ajax.cart.retrieve().then(({status, json}) => {
      dispatch(receiveCart(json))
    }).catch(error => {});
  }
}

export function addCartItem(item) {
  return (dispatch, getState) => {
    return api.ajax.cart.addItem(item).then(({status, json}) => {
      dispatch(receiveCart(json))
    }).catch(error => {});
  }
}

export function updateCartItemQuantiry(item_id, quantity) {
  return (dispatch, getState) => {
    return api.ajax.cart.updateItem(item_id, {quantity: quantity}).then(({status, json}) => {
      dispatch(receiveCart(json))
      dispatch(fetchShippingMethods())
    }).catch(error => {});
  }
}

export function deleteCartItem(item_id) {
  return (dispatch, getState) => {
    return api.ajax.cart.deleteItem(item_id).then(({status, json}) => {
      dispatch(receiveCart(json))
      dispatch(fetchShippingMethods())
    }).catch(error => {});
  }
}

export function updateCartShippingCountry(country) {
  return (dispatch, getState) => {
    return [
      api.ajax.cart.updateShippingAddress({
        country: country
      }),
      api.ajax.cart.update({
        payment_method_id: null,
        shipping_method_id: null
      })
    ].reduce((p, fn) => p.then(() => fn), Promise.resolve()).then(({status, json}) => {
      dispatch(receiveCart(json))
      dispatch(fetchShippingMethods())
      dispatch(fetchPaymentMethods())
    }).catch(error => {});
  }
}

export function updateCartShippingState(state) {
  return (dispatch, getState) => {
    return [
      api.ajax.cart.updateShippingAddress({
        state: state
      }),
      api.ajax.cart.update({
        payment_method_id: null,
        shipping_method_id: null
      })
    ].reduce((p, fn) => p.then(() => fn), Promise.resolve()).then(({status, json}) => {
      dispatch(receiveCart(json))
      dispatch(fetchShippingMethods())
      dispatch(fetchPaymentMethods())
    }).catch(error => {});
  }
}

export function updateCartShippingCity(city) {
  return (dispatch, getState) => {
    return [
      api.ajax.cart.updateShippingAddress({
        city: city
      }),
      api.ajax.cart.update({
        payment_method_id: null,
        shipping_method_id: null
      })
    ].reduce((p, fn) => p.then(() => fn), Promise.resolve()).then(({status, json}) => {
      dispatch(receiveCart(json))
      dispatch(fetchShippingMethods())
      dispatch(fetchPaymentMethods())
    }).catch(error => {});
  }
}

export function updateCartShippingMethod(method_id) {
  return (dispatch, getState) => {
    api.ajax.cart.update({
      payment_method_id: null,
      shipping_method_id: method_id
    }).then(({status, json}) => {
      dispatch(receiveCart(json))
      dispatch(fetchPaymentMethods())
    }).catch(error => {});
  }
}

export function updateCartPaymentMethod(method_id) {
  return (dispatch, getState) => {
    api.ajax.cart.update({
      payment_method_id: method_id
    }).then(({status, json}) => {
      dispatch(receiveCart(json))
    }).catch(error => {});
  }
}

export function updateCart(cart) {
  return (dispatch, getState) => {
    return [
      api.ajax.cart.updateShippingAddress(cart.shipping_address),
      api.ajax.cart.updateBillingAddress(cart.billing_address),
      api.ajax.cart.update({
        email: cart.email,
        mobile: cart.mobile,
        payment_method_id: cart.payment_method_id,
        shipping_method_id: cart.shipping_method_id
        // coupon: cart.coupon
      })
    ].reduce((p, fn) => p.then(() => fn), Promise.resolve()).then(({status, json}) => {
      dispatch(receiveCart(json))
      dispatch(fetchShippingMethods())
      dispatch(fetchPaymentMethods())
    }).catch(error => {});
  }
}

export function checkout(cart) {
  return (dispatch, getState) => {
    dispatch(requestCheckout())
    return [
      api.ajax.cart.updateShippingAddress(cart.shipping_address),
      api.ajax.cart.updateBillingAddress(cart.billing_address),
      api.ajax.cart.update({
        email: cart.email,
        mobile: cart.mobile,
        payment_method_id: cart.payment_method_id,
        shipping_method_id: cart.shipping_method_id,
        draft: false
        // coupon: cart.coupon
      }),
      api.ajax.cart.checkout()
    ].reduce((p, fn) => p.then(() => fn), Promise.resolve()).then(({status, json}) => {
      dispatch(receiveCheckout(json))
      dispatch(push('/checkout-success'));
    }).catch(error => {});
  }
}

export function fetchCategories() {
  return (dispatch, getState) => {
    return api.ajax.product_categories.list({ enabled: true }).then(({status, json}) => {
      dispatch(receiveCategories(json))
    }).catch(error => {});
  }
}

export function fetchProduct(product_id) {
  return (dispatch, getState) => {
    return api.ajax.products.retrieve(product_id).then(({status, json}) => {
      dispatch(receiveProduct(json))
    }).catch(error => {});
  }
}

export function fetchProducts() {
  return (dispatch, getState) => {
    const state = getState();

    let filter = state.app.productsFilter;
    filter.thumbnail_width = 320,
    filter.enabled = true;
    filter.category_id = state.app.currentCategory.id;
    filter.fields = 'path,id,name,category_id,category_name,sku,images,enabled,discontinued,stock_status,stock_quantity,price,on_sale,regular_price';

    return api.ajax.products.list(filter).then(({status, json}) => {
      dispatch(receiveProducts(json))
    }).catch(error => {});
  }
}

export function fetchPage(pageId) {
  return (dispatch, getState) => {
    return api.ajax.pages.retrieve(pageId).then(({status, json}) => {
      dispatch(receivePage(json))
    }).catch(error => {});
  }
}

const getCategories = () => {
  return api.ajax.product_categories.list({ enabled: true }).then(({status, json}) => json)
}

const getProducts = (filter) => {
  return api.ajax.products.list(filter).then(({status, json}) => json)
}

const getProduct = (currentPage) => {
  if (currentPage.type === 'product') {
    return api.ajax.products.retrieve(currentPage.resource).then(({status, json}) => json)
  } else {
    return Promise.resolve();
  }
}

const getCart = (cookie) => {
  return api.ajax.cart.retrieve(cookie).then(({status, json}) => json)
}

const getPage = (currentPage) => {
  if (currentPage.type === 'page') {
    return api.ajax.pages.retrieve(currentPage.resource).then(pageResponse => {
      return pageResponse.json;
    })
  } else {
    return Promise.resolve({});
  }
}

const getCommonData = (req, currentPage, productsFilter) => {
  const cookie = req.get('cookie');
  return Promise.all([
    getCategories(),
    getProduct(currentPage),
    getProducts(productsFilter),
    getCart(cookie),
    getPage(currentPage)]).then(([categories, product, products, cart, page]) => {
      let currentCategory = null;
      if (currentPage.type === 'product-category') {
        currentCategory = categories.find(c => c.id === currentPage.resource);
      }
      return {categories, product, products, currentCategory, cart, page}
  });
}

export const getInitialState = (req, checkout_fields, currentPage) => {
  let initialState = {
    app: {
      language: 'en',
      location: null,
      currentPage: currentPage,
      currentCategory: null,
      currentProduct: null,
      categories: [],
      products: [],
      payment_methods: [],
      shipping_methods: [],
      page: {},
      loadingShippingMethods: false,
      loadingPaymentMethods: false,
      processingCheckout: false,
      cart: null,
      order: null,
      productsFilter: {
        limit: 20,
        thumbnail_width: 320,
        enabled: true,
        fields: 'path,id,name,category_id,category_name,sku,images,enabled,discontinued,stock_status,stock_quantity,price,on_sale,regular_price'
      },
      checkout_fields: checkout_fields
    }
  }

  if (currentPage.type === 'product-category') {
    initialState.app.productsFilter.category_id = currentPage.resource;
  }

  return getCommonData(req, currentPage, initialState.app.productsFilter).then(commonData => {
    initialState.app.categories = commonData.categories;
    initialState.app.currentProduct = commonData.product;
    initialState.app.products = commonData.products;
    initialState.app.currentCategory = commonData.currentCategory;
    initialState.app.cart = commonData.cart;
    initialState.app.page = commonData.page;
    return initialState;
  })

}
