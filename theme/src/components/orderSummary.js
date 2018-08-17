import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { themeSettings, text } from '../lib/settings';
import * as helper from '../lib/helper';

const SummaryItem = ({ settings, item, updateCartItemQuantiry }) => {
	const thumbnail = helper.getThumbnailUrl(
		item.image_url,
		themeSettings.cartThumbnailWidth
	);
	const qtyOptions = [];
	const maxQty = item.stock_backorder
		? themeSettings.maxCartItemQty
		: item.stock_quantity >= themeSettings.maxCartItemQty
			? themeSettings.maxCartItemQty
			: item.stock_quantity;

	for (let i = 0; i <= maxQty; i++) {
		const optionText = i === 0 ? text.remove : i;
		qtyOptions.push(
			<option key={i} value={i}>
				{optionText}
			</option>
		);
	}

	return (
		<div className="columns is-mobile">
			<div className="column is-3">
				<div className="image">
					<NavLink to={item.path}>
						<img
							className="product-image"
							src={thumbnail}
							alt={item.name}
							title={item.name}
						/>
					</NavLink>
				</div>
			</div>
			<div className="column">
				<div>
					<NavLink to={item.path}>{item.name}</NavLink>
				</div>
				{item.variant_name.length > 0 && (
					<div className="cart-option-name">{item.variant_name}</div>
				)}
				<div className="qty">
					<span>{text.qty}:</span>
					<span className="select is-small">
						<select
							onChange={e => {
								updateCartItemQuantiry(item.id, e.target.value);
							}}
							value={item.quantity}
						>
							{qtyOptions}
						</select>
					</span>
				</div>
			</div>
			<div className="column is-3 has-text-right price">
				{helper.formatCurrency(item.price_total, settings)}
			</div>
		</div>
	);
};

SummaryItem.propTypes = {
	settings: PropTypes.shape({}).isRequired,
	item: PropTypes.shape({}).isRequired,
	updateCartItemQuantiry: PropTypes.func.isRequired
};

const OrderSummary = props => {
	const {
		updateCartItemQuantiry,
		state: { cart, settings }
	} = props;

	if (cart && cart.items && cart.items.length > 0) {
		const items = cart.items.map(item => (
			<SummaryItem
				key={item.id}
				item={item}
				updateCartItemQuantiry={updateCartItemQuantiry}
				settings={settings}
			/>
		));

		return (
			<div
				className="checkout-box content is-small"
				style={{ paddingBottom: 0 }}
			>
				<div className="title is-4">{text.orderSummary}</div>
				<hr className="separator" />
				{items}
				<div className="columns is-mobile is-gapless is-multiline summary-block">
					<div className="column is-7">{text.subtotal}</div>
					<div className="column is-5 has-text-right price">
						{helper.formatCurrency(cart.subtotal, settings)}
					</div>
					<div className="column is-7">{text.shipping}</div>
					<div className="column is-5 has-text-right price">
						{helper.formatCurrency(cart.shipping_total, settings)}
					</div>

					{cart.discount_total > 0 && (
						<div className="column is-7">{text.discount}</div>
					)}
					{cart.discount_total > 0 && (
						<div className="column is-5 has-text-right price">
							{helper.formatCurrency(cart.discount_total, settings)}
						</div>
					)}

					<div className="column is-12">
						<hr className="separator" />
					</div>
					<div className="column is-6 total-text">{text.grandTotal}</div>
					<div className="column is-6 total-price">
						{helper.formatCurrency(cart.grand_total, settings)}
					</div>
				</div>
			</div>
		);
	}
	return null;
};

OrderSummary.propTypes = {
	updateCartItemQuantiry: PropTypes.func.isRequired,
	state: PropTypes.shape({
		cart: PropTypes.shape({}),
		settings: PropTypes.shape({}).isRequired
	}).isRequired
};

export default OrderSummary;
