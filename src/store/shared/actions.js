import * as t from './actionTypes'
import {PAGE, PRODUCT_CATEGORY, PRODUCT, RESERVED, SEARCH} from './pageTypes'
import queryString from 'query-string'
import api from '../client/api'

const PRODUCTS_FIELDS = 'path,id,name,category_id,category_name,sku,images,enabled,discontinued,stock_status,stock_quantity,price,on_sale,regular_price,attributes';

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

  let filter = getParsedProductFilter(app.productFilter);

  return api.ajax.products.list(filter).then(({status, json}) => {
    dispatch(receiveProducts(json))
  }).catch(error => {});
}

export const getProductFilterForCategory = (locationSearch) => {
  const queryFilter = queryString.parse(locationSearch);

  let attributes = {};
  for(const querykey in queryFilter){
    if(querykey.startsWith('attributes.')){
      attributes[querykey] = queryFilter[querykey];
    }
  }

  return {
    priceFrom: parseInt(queryFilter.price_from || 0),
    priceTo: parseInt(queryFilter.price_to || 0),
    attributes: attributes
  }
}

export const getProductFilterForSearch = (locationSearch) => {
  const queryFilter = queryString.parse(locationSearch);

  return {
    categoryId: null,
    priceFrom: parseInt(queryFilter.price_from || 0),
    priceTo: parseInt(queryFilter.price_to || 0),
    search: queryFilter.search
  }
}


export const getParsedProductFilter = (productFilter) => {
  const filter = Object.assign({},
    {
      on_sale: productFilter.onSale,
      search: productFilter.search,
      category_id: productFilter.categoryId,
      price_from: productFilter.priceFrom,
      price_to: productFilter.priceTo,
      sort: productFilter['sort'],
      fields: PRODUCTS_FIELDS,
      limit: 30,
      offset: 0
    },
    productFilter.attributes
  )

  return filter;
}

const requestProducts = () => ({type: t.PRODUCTS_REQUEST})

const receiveProducts = (products) => ({type: t.PRODUCTS_RECEIVE, products})

export const fetchMoreProducts = () => (dispatch, getState) => {
  const {app} = getState();
  if (app.loadingProducts || app.loadingMoreProducts || app.products.length === 0 || !app.productsHasMore) {
    return Promise.resolve();
  } else {
    dispatch(requestMoreProducts());

    let filter = getParsedProductFilter(app.productFilter);
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
  return api.ajax.paymentMethods.list().then(({status, json}) => {
    dispatch(receivePaymentMethods(json))
  }).catch(error => {});
}

const requestPaymentMethods = () => ({type: t.PAYMENT_METHODS_REQUEST})

const receivePaymentMethods = methods => ({type: t.PAYMENT_METHODS_RECEIVE, methods})

export const fetchShippingMethods = () => (dispatch, getState) => {
  dispatch(requestShippingMethods())
  return api.ajax.shippingMethods.list().then(({status, json}) => {
    dispatch(receiveShippingMethods(json))
  }).catch(error => {});
}

const requestShippingMethods = () => ({type: t.SHIPPING_METHODS_REQUEST})

const receiveShippingMethods = methods => ({
  type : t.SHIPPING_METHODS_RECEIVE,
  methods
})

export const checkout = (cart, history) => (dispatch, getState) => {
  dispatch(requestCheckout())
  return api.ajax.cart.updateShippingAddress(cart.shipping_address)
    .then(() => api.ajax.cart.updateBillingAddress(cart.billing_address))
    .then(() => api.ajax.cart.update({
      email: cart.email,
      mobile: cart.mobile,
      payment_method_id: cart.payment_method_id,
      shipping_method_id: cart.shipping_method_id,
      comments: cart.comments
      // coupon: cart.coupon
    }))
    .then(() => api.ajax.cart.checkout())
    .then(orderResponse => {
      dispatch(receiveCheckout(orderResponse.json))
      history.push('/checkout-success');
    })
    .catch(error => {});
}

const requestCheckout = () => ({type: t.CHECKOUT_REQUEST})

const receiveCheckout = order => ({type: t.CHECKOUT_RECEIVE, order})

export const receiveSitemap = currentPage => ({type: t.SITEMAP_RECEIVE, currentPage})

export const setCurrentLocation = location => ({type: t.LOCATION_CHANGED, location})

export const setCategory = categoryId => (dispatch, getState) => {
  const {app} = getState();
  const category = app.categories.find(c => c.id === categoryId);
  if (category) {
    dispatch(setCurrentCategory(category));
    dispatch(setProductsFilter({categoryId: categoryId}));
    dispatch(receiveProduct(null));
  }
}

const setCurrentCategory = category => ({type: t.SET_CURRENT_CATEGORY, category})

export const setSort = sort => (dispatch, getState) => {
  dispatch(setProductsFilter({sort: sort}));
  dispatch(fetchProducts());
}

const setProductsFilter = filter => ({type: t.SET_PRODUCTS_FILTER, filter: filter})

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
      email: cart.email,
      mobile: cart.mobile,
      payment_method_id: cart.payment_method_id,
      shipping_method_id: cart.shipping_method_id,
      comments: cart.comments
      // coupon: cart.coupon
    })
  ].reduce((p, fn) => p.then(() => fn), Promise.resolve()).then(({status, json}) => {
    dispatch(receiveCart(json))
    dispatch(fetchShippingMethods())
    dispatch(fetchPaymentMethods())
  }).catch(error => {});
}

export const setCurrentPage = location => (dispatch, getState) => {
  let locationPathname = '/404';
  let locationSearch = '';
  let locationHash = '';

  if(location){
    locationPathname = location.pathname;
    locationSearch = location.search;
    locationHash = location.hash;
  }

  const {app} = getState();
  let statePathname = '/404';
  let stateSearch = '';
  let stateHash = '';

  if(app.location){
    statePathname = app.location.pathname;
    stateSearch = app.location.search;
    stateHash = app.location.hash;
  }

  const currentPageAlreadyInState = statePathname === locationPathname && stateSearch === locationSearch;

  if(currentPageAlreadyInState) {
    // same page
  } else {
    dispatch(setCurrentLocation({
      hasHistory: true,
      pathname: locationPathname,
      search: locationSearch,
      hash: locationHash
    }));

    const category = app.categories.find(c => c.path === locationPathname);
    if(category){
      const newCurrentPage = {
        type: 'product-category',
        path: category.path,
        resource: category.id
      };
      dispatch(receiveSitemap(newCurrentPage))
      dispatch(fetchDataOnCurrentPageChange(newCurrentPage))
    } else {
      api.ajax.sitemap.retrieve({ path: locationPathname })
      .then(sitemapResponse => {
        if(sitemapResponse.status === 404){
          dispatch(receiveSitemap({
            type: 404,
            path: locationPathname,
            resource: null
          }))
        } else {
          const newCurrentPage = sitemapResponse.json;
          dispatch(receiveSitemap(newCurrentPage))
          dispatch(fetchDataOnCurrentPageChange(newCurrentPage))
        }
      });
    }
  }
}

const fetchDataOnCurrentPageChange = currentPage => (dispatch, getState) => {
  const {app} = getState();
  let productFilter = null;

  // clear product data
  dispatch(receiveProduct(null));

  switch(currentPage.type){
    case PRODUCT_CATEGORY:
      productFilter = getProductFilterForCategory(app.location.search);
      dispatch(setCategory(currentPage.resource));
      dispatch(setProductsFilter(productFilter));
      dispatch(fetchProducts());
      break;
    case SEARCH:
      productFilter = getProductFilterForSearch(app.location.search);
      dispatch(setProductsFilter(productFilter));
      dispatch(fetchProducts());
      break;
    case PRODUCT:
      dispatch(fetchProduct(currentPage.resource))
      break;
    case PAGE:
      dispatch(fetchPage(currentPage.resource))
      break;
  }
}
