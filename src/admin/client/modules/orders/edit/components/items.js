import React from 'react';
import { Link } from 'react-router-dom';

import messages from 'lib/text';
import * as helper from 'lib/helper';
import style from './style.css';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import Dialog from 'material-ui/Dialog';

const iconButtonElement = (
	<IconButton touch={true}>
		<FontIcon color="rgb(189, 189, 189)" className="material-icons">
			more_vert
		</FontIcon>
	</IconButton>
);

const ProductOption = ({ option, onChange, selectedOptions }) => {
	const selectedValue = selectedOptions[option.id];
	const values = option.values
		.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
		.map((value, index) => (
			<MenuItem key={index} value={value.id} primaryText={value.name} />
		));

	return (
		<SelectField
			floatingLabelText={option.name}
			fullWidth={true}
			value={selectedValue}
			onChange={(event, index, value) => {
				onChange(option.id, value);
			}}
		>
			{values}
		</SelectField>
	);
};

const ProductOptions = ({ options, onChange, selectedOptions }) => {
	if (options) {
		const items = options.map((option, index) => (
			<ProductOption
				key={index}
				option={option}
				onChange={onChange}
				selectedOptions={selectedOptions}
			/>
		));
		return <div className="product-options">{items}</div>;
	} else {
		return null;
	}
};

export class OrderItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			quantity: props.item.quantity,
			variantId: props.item.variant_id,
			selectedOptions: this.getOptionsByVariant(),
			selectedVariant: this.getCurrentVariant(),
			showEdit: false
		};
	}

	showEditForm = () => {
		this.setState({ showEdit: true });
	};

	hideEditForm = () => {
		this.setState({ showEdit: false });
	};

	quantityChange = (event, index, value) => {
		this.setState({ quantity: value });
	};

	submitEditForm = () => {
		this.hideEditForm();
		const newVariantId =
			this.state.selectedVariant && this.state.selectedVariant.id
				? this.state.selectedVariant.id
				: this.state.variantId;
		this.props.onItemUpdate(
			this.props.item.id,
			this.state.quantity,
			newVariantId
		);
	};

	deleteItem = () => {
		this.props.onItemDelete(this.props.item.id);
	};

	onOptionChange = (optionId, valueId) => {
		this.setState({ quantity: 1 });
		let { selectedOptions } = this.state;

		if (valueId === '') {
			delete selectedOptions[optionId];
		} else {
			selectedOptions[optionId] = valueId;
		}

		this.setState({ selectedOptions: selectedOptions });
		this.findVariantBySelectedOptions();
	};

	findVariantBySelectedOptions = () => {
		const { selectedOptions } = this.state;
		const product = this.props.item.product;
		for (const variant of product.variants) {
			const variantMutchSelectedOptions = variant.options.every(
				variantOption =>
					selectedOptions[variantOption.option_id] === variantOption.value_id
			);
			if (variantMutchSelectedOptions) {
				this.setState({ selectedVariant: variant });
				return;
			}
		}

		this.setState({ selectedVariant: null });
	};

	getCurrentVariant = () => {
		const variantId = this.props.item.variant_id;
		const product = this.props.item.product;
		let variant = null;

		if (
			variantId &&
			product &&
			product.variants &&
			product.variants.length > 0
		) {
			variant = product.variants.find(v => v.id === variantId);
		}

		return variant;
	};

	getOptionsByVariant = () => {
		const variantId = this.props.item.variant_id;
		const product = this.props.item.product;
		let selectedOptions = {};
		if (
			variantId &&
			product &&
			product.variants &&
			product.variants.length > 0
		) {
			const variant = product.variants.find(v => v.id === variantId);
			if (variant) {
				for (const option of variant.options) {
					selectedOptions[option.option_id] = option.value_id;
				}
			}
		}

		return selectedOptions;
	};

	render() {
		const { item, settings, allowEdit } = this.props;

		const editFormActions = [
			<FlatButton
				label={messages.cancel}
				onClick={this.hideEditForm}
				style={{ marginRight: 10 }}
			/>,
			<FlatButton
				label={messages.save}
				primary={true}
				onClick={this.submitEditForm}
			/>
		];

		let { quantity } = this.state;
		const { selectedOptions, selectedVariant } = this.state;
		const product = item.product;
		const price = helper.formatCurrency(item.price, settings);
		const priceTotal = helper.formatCurrency(item.price_total, settings);
		const discountTotal = helper.formatCurrency(item.discount_total, settings);
		const imageUrl =
			product && product.images.length > 0 ? product.images[0].url : null;
		const thumbnailUrl = helper.getThumbnailUrl(imageUrl, 100);
		const productOptions = product ? product.options : [];

		let maxItems = product ? product.stock_quantity : 0;
		if (selectedVariant) {
			maxItems = selectedVariant.stock_quantity;
		} else if (product && product.options && product.options.length > 0) {
			// product variant not exists with this options
			maxItems = 0;
		}

		const quantityItems = [];
		if (maxItems === 0) {
			quantityItems.push(
				<MenuItem
					key={0}
					value={0}
					primaryText={messages.products_outOfStock}
				/>
			);
			quantity = 0;
		} else {
			for (let i = 1; i <= maxItems, i <= 100; i++) {
				quantityItems.push(
					<MenuItem key={i} value={i} primaryText={i.toString()} />
				);
			}
		}

		return (
			<div>
				<div className={style.item + ' row row--no-gutter middle-xs'}>
					<div className="col-xs-2">
						{thumbnailUrl &&
							thumbnailUrl !== '' && (
								<img src={thumbnailUrl} className={style.itemImage} />
							)}
					</div>
					<div className={style.itemName + ' col-xs-4'}>
						<Link to={`/admin/product/${item.product_id}`}>{item.name}</Link>
						<div>{item.variant_name}</div>
						<div>
							{messages.products_sku}: {item.sku}
						</div>
					</div>
					<div className="col-xs-2" style={{ textAlign: 'right' }}>
						{price}
					</div>
					<div className="col-xs-1" style={{ textAlign: 'center' }}>
						x {item.quantity}
					</div>
					<div className="col-xs-2" style={{ textAlign: 'right' }}>
						{priceTotal}
						{item.discount_total > 0 && (
							<small className={style.itemDiscount}>{discountTotal}</small>
						)}
					</div>
					<div className="col-xs-1" style={{ textAlign: 'center' }}>
						{allowEdit && (
							<IconMenu
								iconButtonElement={iconButtonElement}
								targetOrigin={{ horizontal: 'right', vertical: 'top' }}
								anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
							>
								<MenuItem onClick={this.showEditForm}>{messages.edit}</MenuItem>
								<MenuItem onClick={this.deleteItem}>
									{messages.actions_delete}
								</MenuItem>
							</IconMenu>
						)}
					</div>
				</div>
				<Divider />
				<Dialog
					title={messages.editOrderItem}
					actions={editFormActions}
					modal={false}
					open={this.state.showEdit}
					onRequestClose={this.hideEditForm}
					contentStyle={{ width: 400 }}
				>
					<div>
						<ProductOptions
							options={productOptions}
							onChange={this.onOptionChange}
							selectedOptions={selectedOptions}
						/>
						<SelectField
							floatingLabelText={messages.quantity}
							fullWidth={true}
							value={quantity}
							onChange={this.quantityChange}
						>
							{quantityItems}
						</SelectField>
					</div>
				</Dialog>
			</div>
		);
	}
}

const OrderItems = ({ order, settings, onItemDelete, onItemUpdate }) => {
	const allowEdit = order.closed === false && order.cancelled === false;
	const items = order.items.map((item, index) => (
		<OrderItem
			key={index}
			item={item}
			settings={settings}
			onItemDelete={onItemDelete}
			onItemUpdate={onItemUpdate}
			allowEdit={allowEdit}
		/>
	));
	return <div>{items}</div>;
};

export default OrderItems;
