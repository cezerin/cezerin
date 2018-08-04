import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { text } from '../lib/settings';
import * as helper from '../lib/helper';

const getCheckoutField = (checkoutFields, fieldName) => {
	if (checkoutFields && checkoutFields.length > 0) {
		return checkoutFields.find(
			f => f.name === fieldName && f.status !== 'hidden'
		);
	}
	return null;
};

const MobileField = ({ order, checkoutFields }) => {
	const checkoutField = getCheckoutField(checkoutFields, 'mobile');
	return checkoutField && order.mobile !== '' ? (
		<ShippingFieldDiv
			label={helper.getCheckoutFieldLabel(checkoutField)}
			value={order.mobile}
		/>
	) : null;
};

const CityField = ({ order, checkoutFields }) => {
	const checkoutField = getCheckoutField(checkoutFields, 'city');
	return checkoutField && order.shipping_address.city !== '' ? (
		<ShippingFieldDiv
			label={helper.getCheckoutFieldLabel(checkoutField)}
			value={order.shipping_address.city}
		/>
	) : null;
};

const CommentsField = ({ order, checkoutFields }) => {
	const checkoutField = getCheckoutField(checkoutFields, 'comments');
	return checkoutField && order.comments !== '' ? (
		<ShippingFieldDiv
			label={helper.getCheckoutFieldLabel(checkoutField)}
			value={order.comments}
		/>
	) : null;
};

const ShippingFields = ({ order, shippingMethod }) => {
	let shippingFields = null;
	if (
		shippingMethod &&
		shippingMethod.fields &&
		shippingMethod.fields.length > 0
	) {
		shippingFields = shippingMethod.fields.map((field, index) => {
			const fieldLabel = helper.getShippingFieldLabel(field);
			const fieldValue = order.shipping_address[field.key];

			return (
				<ShippingFieldDiv key={index} label={fieldLabel} value={fieldValue} />
			);
		});
	}

	return <div>{shippingFields}</div>;
};

const ShippingFieldDiv = ({ label, value }) => (
	<div className="shipping-field">
		<label>{label}: </label>
		{value}
	</div>
);

const OrderItem = ({ item, settings }) => (
	<div className="columns is-mobile is-gapless checkout-success-row">
		<div className="column is-6">
			{item.name}
			<br />
			<span>{item.variant_name}</span>
		</div>
		<div className="column is-2 has-text-right">
			{helper.formatCurrency(item.price, settings)}
		</div>
		<div className="column is-2 has-text-centered">{item.quantity}</div>
		<div className="column is-2 has-text-right">
			{helper.formatCurrency(item.price_total, settings)}
		</div>
	</div>
);

const OrderItems = ({ items, settings }) => {
	if (items && items.length > 0) {
		const rows = items.map(item => (
			<OrderItem key={item.id} item={item} settings={settings} />
		));
		return <div>{rows}</div>;
	}
	return null;
};

const CheckoutSuccess = ({
	order,
	settings,
	pageDetails,
	shippingMethod,
	checkoutFields
}) => {
	if (order && order.items && order.items.length > 0) {
		return (
			<div className="checkout-success-details">
				<h1 className="checkout-success-title">
					<img src="/assets/images/success.svg" alt="" />
					<br />
					{text.checkoutSuccessTitle}
				</h1>

				<div
					dangerouslySetInnerHTML={{
						__html: pageDetails.content
					}}
				/>

				<hr />

				<div className="columns" style={{ marginBottom: '3rem' }}>
					<div className="column is-6">
						<b>{text.shipping}</b>
						<MobileField order={order} checkoutFields={checkoutFields} />
						<CityField order={order} checkoutFields={checkoutFields} />
						<ShippingFields order={order} shippingMethod={shippingMethod} />
						<CommentsField order={order} checkoutFields={checkoutFields} />
					</div>

					<div className="column is-6">
						<b>{text.orderNumber}</b>: {order.number}
						<br />
						<b>{text.shippingMethod}</b>: {order.shipping_method}
						<br />
						<b>{text.paymentMethod}</b>: {order.payment_method}
						<br />
					</div>
				</div>

				<div className="columns is-mobile is-gapless checkout-success-row">
					<div className="column is-6">
						<b>{text.productName}</b>
					</div>
					<div className="column is-2 has-text-right">
						<b>{text.price}</b>
					</div>
					<div className="column is-2 has-text-centered">
						<b>{text.qty}</b>
					</div>
					<div className="column is-2 has-text-right">
						<b>{text.total}</b>
					</div>
				</div>

				<OrderItems items={order.items} settings={settings} />

				<div className="columns">
					<div className="column is-offset-7 checkout-success-totals">
						<div>
							<span>{text.subtotal}:</span>
							<span>{helper.formatCurrency(order.subtotal, settings)}</span>
						</div>
						<div>
							<span>{text.shipping}:</span>
							<span>
								{helper.formatCurrency(order.shipping_total, settings)}
							</span>
						</div>
						<div>
							<b>{text.grandTotal}:</b>
							<b>{helper.formatCurrency(order.grand_total, settings)}</b>
						</div>
					</div>
				</div>
			</div>
		);
	}
	return <div className="has-text-centered">{text.cartEmpty}</div>;
};

CheckoutSuccess.propTypes = {
	order: PropTypes.shape({}),
	settings: PropTypes.shape({}).isRequired,
	pageDetails: PropTypes.shape({}).isRequired,
	shippingMethod: PropTypes.shape({}).isRequired,
	checkoutFields: PropTypes.arrayOf(PropTypes.shape({})).isRequired
};

CheckoutSuccess.defaultProps = {
	order: null
};

export default CheckoutSuccess;
