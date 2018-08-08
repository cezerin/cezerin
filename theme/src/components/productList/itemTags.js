import React from 'react';
import { themeSettings, text } from '../../lib/settings';
import * as helper from '../../lib/helper';

const ItemTags = ({ tags }) => {
	if (tags && tags.length > 0) {
		return (
			<div className="tags">
				{tags.map((tag, index) => (
					<span key={index} className="tag">
						{tag}
					</span>
				))}
			</div>
		);
	}
	return null;
};

export default ItemTags;
