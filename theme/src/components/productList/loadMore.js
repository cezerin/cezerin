import React from 'react';
import { themeSettings, text } from '../../lib/settings';

const LoadMore = ({
	loadMoreProducts,
	hasMore,
	loading,
	className = 'button is-fullwidth is-dark'
}) => {
	if (hasMore) {
		const buttonStyle = {};
		if (
			themeSettings.button_loadmore_bg &&
			themeSettings.button_loadmore_bg.length > 0
		) {
			buttonStyle.backgroundColor = themeSettings.button_loadmore_bg;
		}
		if (
			themeSettings.button_loadmore_color &&
			themeSettings.button_loadmore_color.length > 0
		) {
			buttonStyle.color = themeSettings.button_loadmore_color;
		}

		const loadMoreText =
			themeSettings.button_loadmore_text &&
			themeSettings.button_loadmore_text.length > 0
				? themeSettings.button_loadmore_text
				: text.loadMore;

		return (
			<button
				onClick={loadMoreProducts}
				className={className + (loading ? ' is-loading' : '')}
				style={buttonStyle}
			>
				{loadMoreText}
			</button>
		);
	}
	return null;
};

export default LoadMore;
