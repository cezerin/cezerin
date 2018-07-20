import React from 'react';
import * as helper from '../../lib/helper';
import { themeSettings, text } from '../../lib/settings';

const Tags = ({ tags }) => {
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
	} else {
		return null;
	}
};

export default Tags;
