import {
	PAGE,
	PRODUCT_CATEGORY,
	PRODUCT,
	RESERVED,
	SEARCH
} from '../pageTypes';
import * as googleAnalytics from './googleAnalytics';

export const onPageLoad = ({ state }) => {
	const { currentPage, productDetails, productFilter, cart } = state.app;

	switch (currentPage.type) {
		case PRODUCT:
			productView({ product: productDetails });
			break;
		case SEARCH:
			search({ searchText: productFilter.search });
			break;
		case PAGE:
			if (currentPage.path === '/checkout') {
				checkoutView({ order: cart });
			}
			break;
	}
};

export const pageView = ({ path, title }) => {
	googleAnalytics.pageView({ path, title });
};

export const productView = ({ product }) => {
	googleAnalytics.viewItem({ product });
};

export const search = ({ searchText }) => {
	if (searchText && searchText.length > 0) {
		googleAnalytics.search({ searchText });
	}
};

export const addCartItem = ({ item, cart }) => {
	googleAnalytics.addToCart({ item, cart });
};

export const deleteCartItem = ({ itemId, cart }) => {
	googleAnalytics.removeFromCart({ itemId, cart });
};

export const checkoutView = ({ order }) => {
	if (order && order.items && order.items.length > 0) {
		googleAnalytics.beginCheckout({ order });
	}
};

export const checkoutSuccess = ({ order }) => {
	if (order && order.items && order.items.length > 0) {
		googleAnalytics.purchase({ order });
	}
};

const findMethodById = ({ methodId, allMethods }) => {
	if (methodId && allMethods && allMethods.length > 0) {
		return allMethods.find(m => m.id === methodId);
	} else {
		return null;
	}
};

export const setPaymentMethod = ({ methodId, allMethods }) => {
	const method = findMethodById({ methodId, allMethods });
	if (method) {
		googleAnalytics.setCheckoutOption({
			step: 1,
			option: 'payment method',
			value: method.name
		});
	}
};

export const setShippingMethod = ({ methodId, allMethods }) => {
	const method = findMethodById({ methodId, allMethods });
	if (method) {
		googleAnalytics.setCheckoutOption({
			step: 1,
			option: 'shipping method',
			value: method.name
		});
	}
};
