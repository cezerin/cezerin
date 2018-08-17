import React from 'react';
import { NavLink } from 'react-router-dom';
import { text } from './settings';

export const formatNumber = (number, settings) => {
	const x = 3;
	const floatNumber = parseFloat(number || 0) || 0;

	const re = `\\d(?=(\\d{${x}})+${settings.decimal_number > 0 ? '\\D' : '$'})`;

	const num = floatNumber.toFixed(
		Math.max(0, Math.floor(settings.decimal_number))
	);

	return (settings.decimal_separator
		? num.replace('.', settings.decimal_separator)
		: num
	).replace(new RegExp(re, 'g'), `$&${settings.thousand_separator}`);
};

const amountPattern = '{amount}';
export const formatCurrency = (number = 0, settings) =>
	settings.currency_format.replace(
		amountPattern,
		formatNumber(number, settings)
	);

export const getThumbnailUrl = (originalUrl, width) => {
	if (originalUrl && originalUrl.length > 0) {
		const pos = originalUrl.lastIndexOf('/');
		const thumbnailUrl = `${originalUrl.substring(
			0,
			pos
		)}/${width}/${originalUrl.substring(pos + 1)}`;
		return thumbnailUrl;
	}
	return '';
};

export const getParentIds = (categories, id) => {
	let categoryId = id;
	const parentIds = [];
	let parentExists = false;

	do {
		const category = categories.find(item => item.id === categoryId);
		parentExists = category && category.parent_id;
		if (parentExists) {
			parentIds.push(category.parent_id);
			categoryId = category.parent_id;
		}
	} while (parentExists);

	return parentIds;
};

export const getProductBreadcrumbs = (product, categories) => {
	if (product && product.category_id) {
		const ids = [product.category_id];
		const parentIds = getParentIds(categories, product.category_id);
		ids.push(...parentIds);

		let index = 0;
		const breadcrumbs = ids
			.reverse()
			.map(categoryId => {
				const category = categories.find(item => item.id === categoryId);
				if (category) {
					index += 1;
					return (
						<li key={index}>
							<NavLink to={category.path}>{category.name}</NavLink>
						</li>
					);
				}
				return null;
			})
			.filter(item => !!item);

		return breadcrumbs;
	}
	return null;
};

export const getCategoryBreadcrumbs = (currentCategoryId, categories) => {
	if (currentCategoryId) {
		const ids = getParentIds(categories, currentCategoryId);

		let index = 0;
		const breadcrumbs = ids
			.reverse()
			.map(categoryId => {
				const category = categories.find(item => item.id === categoryId);
				if (category) {
					index += 1;
					return (
						<li key={index}>
							<NavLink to={category.path}>{category.name}</NavLink>
						</li>
					);
				}
				return null;
			})
			.filter(item => !!item);

		return breadcrumbs;
	}
	return null;
};

export const getShippingMethodFromOrder = (order, shippingMethods) => {
	if (
		order &&
		order.shipping_method_id &&
		shippingMethods &&
		shippingMethods.length > 0
	) {
		return shippingMethods.find(
			method => method.id === order.shipping_method_id
		);
	}
	return null;
};

export const getFieldLabelByKey = key => {
	switch (key) {
		case 'full_name':
			return text.fullName;
		case 'address1':
			return text.address1;
		case 'address2':
			return text.address2;
		case 'postal_code':
			return text.postal_code;
		case 'phone':
			return text.phone;
		case 'company':
			return text.company;
		case 'mobile':
			return text.mobile;
		case 'city':
			return text.city;
		case 'comments':
			return text.comments;
		default:
			return '';
	}
};

export const getShippingFieldLabel = ({ label, key }) =>
	label && label.length > 0 ? label : getFieldLabelByKey(key);

export const getCheckoutFieldLabel = ({ label, name }) =>
	label && label.length > 0 ? label : getFieldLabelByKey(name);
