import React from 'react';
import * as helper from '../../lib/helper';
import { themeSettings, text } from '../../lib/settings';

const FormattedCurrency = ({ number, settings }) =>
	helper.formatCurrency(number, settings);

const NewAndOldPrices = ({ newPrice, oldPrice, settings }) => (
	<div className="product-price">
		<span className="product-new-price">
			<FormattedCurrency settings={settings} number={newPrice} />
		</span>
		<del className="product-old-price">
			<FormattedCurrency settings={settings} number={oldPrice} />
		</del>
	</div>
);

const Price = ({ product, variant, isAllOptionsSelected, settings }) => {
	let priceStyle = {};
	if (
		themeSettings.details_price_size &&
		themeSettings.details_price_size > 0
	) {
		priceStyle.fontSize = themeSettings.details_price_size + 'px';
	}
	if (
		themeSettings.details_price_color &&
		themeSettings.details_price_color.length > 0
	) {
		priceStyle.color = themeSettings.details_price_color;
	}

	let price = 0;
	let oldPrice = 0;

	if (product.variable && variant && variant.price > 0) {
		price = variant.price;
	} else {
		price = product.price;
	}

	if (product.on_sale) {
		oldPrice = product.regular_price;
	}

	if (oldPrice > 0) {
		return (
			<NewAndOldPrices
				settings={settings}
				newPrice={price}
				oldPrice={oldPrice}
			/>
		);
	} else {
		return (
			<div className="product-price" style={priceStyle}>
				<FormattedCurrency settings={settings} number={price} />
			</div>
		);
	}
};

export default Price;
