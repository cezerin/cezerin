import React from 'react';
import { themeSettings, text } from '../../lib/settings';

const Attribute = ({ name, value }) => (
	<div className="columns is-gapless is-mobile product-attribute">
		<div className="column is-5 attribute-name">{name}:</div>
		<div className="column is-7 attribute-value">{value}</div>
	</div>
);

const Attributes = ({ attributes }) => {
	if (attributes && attributes.length > 0) {
		const items = attributes.map((attribute, index) => (
			<Attribute key={index} name={attribute.name} value={attribute.value} />
		));

		return (
			<div className="product-attributes">
				<div className="title is-5">{text.attributes}</div>
				{items}
			</div>
		);
	} else {
		return null;
	}
};
export default Attributes;
