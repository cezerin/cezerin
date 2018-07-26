const event = {
	PAGE_VIEW: 'page_view',
	VIEW_ITEM: 'view_item',
	BEGIN_CHECKOUT: 'begin_checkout',
	SEARCH: 'search',
	ADD_TO_CART: 'add_to_cart',
	REMOVE_FROM_CART: 'remove_from_cart',
	SET_CHECKOUT_OPTION: 'set_checkout_option',
	PURCHASE: 'purchase'
};

export const pageView = ({ path, title }) => {
	logEvent({
		eventName: event.PAGE_VIEW,
		eventParameters: {
			page_path: path,
			page_title: title
		}
	});
};

export const viewItem = ({ product }) => {
	const productData = {
		id: product.sku && product.sku.length > 0 ? product.sku : product.id,
		name: product.name,
		category: product.category_name,
		price: product.price.toString()
	};

	logEvent({
		eventName: event.VIEW_ITEM,
		eventParameters: {
			items: [productData]
		}
	});
};

export const addToCart = ({ item, cart }) => {
	const cartItem =
		cart && cart.items && cart.items.length > 0
			? cart.items.find(
					e =>
						e.product_id === item.product_id && e.variant_id == item.variant_id
			  )
			: null;
	if (!cartItem) {
		return;
	}

	const gaItem = {
		id:
			cartItem.sku && cartItem.sku.length > 0
				? cartItem.sku
				: cartItem.product_id,
		name: cartItem.name,
		price: cartItem.price.toString(),
		variant: cartItem.variant_name,
		quantity: item.quantity
	};

	logEvent({
		eventName: event.ADD_TO_CART,
		eventParameters: {
			items: [gaItem]
		}
	});
};

export const removeFromCart = ({ itemId, cart }) => {
	const cartItem =
		cart && cart.items && cart.items.length > 0
			? cart.items.find(e => e.id === itemId)
			: null;
	if (!cartItem) {
		return;
	}

	const gaItem = {
		id:
			cartItem.sku && cartItem.sku.length > 0
				? cartItem.sku
				: cartItem.product_id,
		name: cartItem.name,
		price: cartItem.price.toString(),
		variant: cartItem.variant_name,
		quantity: cartItem.quantity
	};

	logEvent({
		eventName: event.REMOVE_FROM_CART,
		eventParameters: {
			items: [gaItem]
		}
	});
};

export const setCheckoutOption = ({ step, option, value }) => {
	logEvent({
		eventName: event.SET_CHECKOUT_OPTION,
		eventParameters: {
			checkout_step: step,
			checkout_option: option,
			value: value
		}
	});
};

export const search = ({ searchText }) => {
	logEvent({
		eventName: event.SEARCH,
		eventParameters: {
			search_term: searchText
		}
	});
};

export const beginCheckout = ({ order }) => {
	const gaItems = order.items.map(item => ({
		id: item.sku && item.sku.length > 0 ? item.sku : item.product_id,
		name: item.name,
		price: item.price.toString(),
		variant: item.variant_name,
		quantity: item.quantity
	}));

	const gaPurchase = {
		transaction_id: order.number,
		value: order.grand_total,
		items: gaItems
	};

	logEvent({
		eventName: event.BEGIN_CHECKOUT,
		eventParameters: gaPurchase
	});
};

export const purchase = ({ order }) => {
	const gaItems = order.items.map(item => ({
		id: item.sku && item.sku.length > 0 ? item.sku : item.product_id,
		name: item.name,
		price: item.price.toString(),
		variant: item.variant_name,
		quantity: item.quantity
	}));

	const gaPurchase = {
		transaction_id: order.number,
		value: order.grand_total,
		tax: order.tax_total.toString(),
		shipping: order.shipping_price.toString(),
		items: gaItems
	};

	logEvent({
		eventName: event.PURCHASE,
		eventParameters: gaPurchase
	});
};

const isGtagInstalled = () => {
	return typeof gtag !== 'undefined';
};

const logEvent = ({ eventName, eventParameters }) => {
	if (isGtagInstalled()) {
		gtag('event', eventName, eventParameters);
	}
};
