import * as t from './actionTypes';
import { PAGE, PRODUCT_CATEGORY, PRODUCT, RESERVED, SEARCH } from './pageTypes';
import queryString from 'query-string';
import { animateScroll } from 'react-scroll';
import api from '../client/api';
import * as analytics from './analytics';

const requestProduct = () => ({ type: t.PRODUCT_REQUEST });

const receiveProduct = product => ({ type: t.PRODUCT_RECEIVE, product });

export const fetchProducts = () => async (dispatch, getState) => {
	dispatch(requestProducts());
	const { app } = getState();
	const filter = getParsedProductFilter(app.productFilter);
	const response = await api.ajax.products.list(filter);
	const products = response.json;
	dispatch(receiveProducts(null));
	dispatch(receiveProducts(products));
};

export const getProductFilterForCategory = (locationSearch, sortBy) => {
	const queryFilter = queryString.parse(locationSearch);

	let attributes = {};
	for (const querykey in queryFilter) {
		if (querykey.startsWith('attributes.')) {
			attributes[querykey] = queryFilter[querykey];
		}
	}

	return {
		priceFrom: parseInt(queryFilter.price_from || 0),
		priceTo: parseInt(queryFilter.price_to || 0),
		attributes: attributes,
		search: null,
		sort: sortBy
	};
};

export const getProductFilterForSearch = locationSearch => {
	const queryFilter = queryString.parse(locationSearch);

	return {
		categoryId: null,
		priceFrom: parseInt(queryFilter.price_from || 0),
		priceTo: parseInt(queryFilter.price_to || 0),
		search: queryFilter.search,
		sort: 'search'
	};
};

export const getParsedProductFilter = productFilter => {
	const filter = Object.assign(
		{},
		{
			on_sale: productFilter.onSale,
			search: productFilter.search,
			category_id: productFilter.categoryId,
			price_from: productFilter.priceFrom,
			price_to: productFilter.priceTo,
			sort: productFilter['sort'],
			fields: productFilter['fields'],
			limit: productFilter['limit'],
			offset: 0
		},
		productFilter.attributes
	);

	return filter;
};

const requestProducts = () => ({ type: t.PRODUCTS_REQUEST });

const receiveProducts = products => ({ type: t.PRODUCTS_RECEIVE, products });

export const fetchMoreProducts = () => async (dispatch, getState) => {
	const { app } = getState();
	if (
		app.loadingProducts ||
		app.loadingMoreProducts ||
		app.products.length === 0 ||
		!app.productsHasMore
	) {
		return;
	} else {
		dispatch(requestMoreProducts());

		const filter = getParsedProductFilter(app.productFilter);
		filter.offset = app.products.length;

		const response = await api.ajax.products.list(filter);
		const products = response.json;
		dispatch(receiveMoreProducts(products));
		animateScroll.scrollMore(200);
	}
};

const requestMoreProducts = () => ({ type: t.MORE_PRODUCTS_REQUEST });

const receiveMoreProducts = products => ({
	type: t.MORE_PRODUCTS_RECEIVE,
	products
});

const requestPage = () => ({ type: t.PAGE_REQUEST });

const receivePage = pageDetails => ({ type: t.PAGE_RECEIVE, pageDetails });

export const fetchCart = () => async (dispatch, getState) => {
	dispatch(requestCart());
	const response = await api.ajax.cart.retrieve();
	const cart = response.json;
	dispatch(receiveCart(cart));
};

const requestCart = () => ({ type: t.CART_REQUEST });

const receiveCart = cart => ({ type: t.CART_RECEIVE, cart });

export const addCartItem = item => async (dispatch, getState) => {
	dispatch(requestAddCartItem());
	const response = await api.ajax.cart.addItem(item);
	const cart = response.json;
	dispatch(receiveCart(cart));
	analytics.addCartItem({
		item: item,
		cart: cart
	});
};

const requestAddCartItem = () => ({ type: t.CART_ITEM_ADD_REQUEST });

export const updateCartItemQuantiry = (item_id, quantity) => async (
	dispatch,
	getState
) => {
	dispatch(requestUpdateCartItemQuantiry());
	const response = await api.ajax.cart.updateItem(item_id, {
		quantity: quantity
	});
	dispatch(receiveCart(response.json));
	dispatch(fetchShippingMethods());
};

const requestUpdateCartItemQuantiry = () => ({
	type: t.CART_ITEM_UPDATE_REQUEST
});

export const deleteCartItem = item_id => async (dispatch, getState) => {
	dispatch(requestDeleteCartItem());
	const { app } = getState();
	const response = await api.ajax.cart.deleteItem(item_id);
	dispatch(receiveCart(response.json));
	dispatch(fetchShippingMethods());
	analytics.deleteCartItem({
		itemId: item_id,
		cart: app.cart
	});
};

const requestDeleteCartItem = () => ({ type: t.CART_ITEM_DELETE_REQUEST });

export const fetchPaymentMethods = () => async (dispatch, getState) => {
	dispatch(requestPaymentMethods());
	const response = await api.ajax.paymentMethods.list();
	dispatch(receivePaymentMethods(response.json));
};

const requestPaymentMethods = () => ({ type: t.PAYMENT_METHODS_REQUEST });

const receivePaymentMethods = methods => ({
	type: t.PAYMENT_METHODS_RECEIVE,
	methods
});

export const fetchShippingMethods = () => async (dispatch, getState) => {
	dispatch(requestShippingMethods());
	const response = await api.ajax.shippingMethods.list();
	dispatch(receiveShippingMethods(response.json));
};

const requestShippingMethods = () => ({ type: t.SHIPPING_METHODS_REQUEST });

const receiveShippingMethods = methods => ({
	type: t.SHIPPING_METHODS_RECEIVE,
	methods
});

export const checkout = (cart, history) => async (dispatch, getState) => {
	dispatch(requestCheckout());
	if (cart) {
		await api.ajax.cart.update({
			shipping_address: cart.shipping_address,
			billing_address: cart.billing_address,
			email: cart.email,
			mobile: cart.mobile,
			payment_method_id: cart.payment_method_id,
			shipping_method_id: cart.shipping_method_id,
			comments: cart.comments
		});
	}

	const cartResponse = await api.ajax.cart.retrieve();
	const chargeNeeded = !!cartResponse.json.payment_token;

	if (chargeNeeded) {
		const chargeResponse = await api.ajax.cart.client.post('/cart/charge');
		const chargeSucceeded = chargeResponse.status === 200;
		if (!chargeSucceeded) {
			return;
		}
	}

	const response = await api.ajax.cart.checkout();
	const order = response.json;
	dispatch(receiveCheckout(order));
	history.push('/checkout-success');
	analytics.checkoutSuccess({ order: order });
};

const requestCheckout = () => ({ type: t.CHECKOUT_REQUEST });

const receiveCheckout = order => ({ type: t.CHECKOUT_RECEIVE, order });

export const receiveSitemap = currentPage => ({
	type: t.SITEMAP_RECEIVE,
	currentPage
});

export const setCurrentLocation = location => ({
	type: t.LOCATION_CHANGED,
	location
});

export const setCategory = categoryId => (dispatch, getState) => {
	const { app } = getState();
	const category = app.categories.find(c => c.id === categoryId);
	if (category) {
		dispatch(setCurrentCategory(category));
		dispatch(setProductsFilter({ categoryId: categoryId }));
		dispatch(receiveProduct(null));
	}
};

const setCurrentCategory = category => ({
	type: t.SET_CURRENT_CATEGORY,
	category
});

export const setSort = sort => (dispatch, getState) => {
	dispatch(setProductsFilter({ sort: sort }));
	dispatch(fetchProducts());
};

const setProductsFilter = filter => ({
	type: t.SET_PRODUCTS_FILTER,
	filter: filter
});

export const analyticsSetShippingMethod = method_id => (dispatch, getState) => {
	const { app } = getState();
	analytics.setShippingMethod({
		methodId: method_id,
		allMethods: app.shippingMethods
	});
};

export const analyticsSetPaymentMethod = method_id => (dispatch, getState) => {
	const { app } = getState();
	analytics.setPaymentMethod({
		methodId: method_id,
		allMethods: app.paymentMethods
	});
};

export const updateCart = (data, callback) => async (dispatch, getState) => {
	const response = await api.ajax.cart.update(data);
	const newCart = response.json;
	dispatch(receiveCart(newCart));
	if (typeof callback === 'function') {
		callback(newCart);
	}
};

export const setCurrentPage = location => async (dispatch, getState) => {
	let locationPathname = '/404';
	let locationSearch = '';
	let locationHash = '';

	if (location) {
		locationPathname = location.pathname;
		locationSearch = location.search;
		locationHash = location.hash;
	}

	const { app } = getState();
	let statePathname = '/404';
	let stateSearch = '';
	let stateHash = '';

	if (app.location) {
		statePathname = app.location.pathname;
		stateSearch = app.location.search;
		stateHash = app.location.hash;
	}

	const currentPageAlreadyInState =
		statePathname === locationPathname && stateSearch === locationSearch;

	if (currentPageAlreadyInState) {
		// same page
	} else {
		dispatch(
			setCurrentLocation({
				hasHistory: true,
				pathname: locationPathname,
				search: locationSearch,
				hash: locationHash
			})
		);

		const category = app.categories.find(c => c.path === locationPathname);
		if (category) {
			const newCurrentPage = {
				type: 'product-category',
				path: category.path,
				resource: category.id
			};
			dispatch(receiveSitemap(newCurrentPage)); // remove .data
			dispatch(fetchDataOnCurrentPageChange(newCurrentPage));
		} else {
			const sitemapResponse = await api.ajax.sitemap.retrieve({
				path: locationPathname
			});
			if (sitemapResponse.status === 404) {
				dispatch(
					receiveSitemap({
						type: 404,
						path: locationPathname,
						resource: null
					})
				);
			} else {
				const newCurrentPage = sitemapResponse.json;
				dispatch(receiveSitemap(newCurrentPage));
				dispatch(fetchDataOnCurrentPageChange(newCurrentPage));
			}
		}
	}
};

const fetchDataOnCurrentPageChange = currentPage => (dispatch, getState) => {
	const { app } = getState();
	let productFilter = null;

	// clear product data
	dispatch(receiveProduct(null));

	analytics.pageView({
		path: currentPage.path,
		title: '-'
	});

	switch (currentPage.type) {
		case PRODUCT_CATEGORY:
			productFilter = getProductFilterForCategory(
				app.location.search,
				app.settings.default_product_sorting
			);
			dispatch(setCategory(currentPage.resource));
			dispatch(setProductsFilter(productFilter));
			dispatch(fetchProducts());
			break;
		case SEARCH:
			productFilter = getProductFilterForSearch(app.location.search);
			dispatch(setProductsFilter(productFilter));
			dispatch(fetchProducts());
			analytics.search({ searchText: productFilter.search });
			break;
		case PRODUCT:
			const productData = currentPage.data;
			dispatch(receiveProduct(productData));
			analytics.productView({ product: productData });
			break;
		case PAGE:
			const pageData = currentPage.data;
			dispatch(receivePage(pageData));
			if (currentPage.path === '/checkout') {
				analytics.checkoutView({ order: app.cart });
			}
			break;
	}
};
