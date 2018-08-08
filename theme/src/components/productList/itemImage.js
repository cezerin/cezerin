import React from 'react';
import LazyLoad from 'react-lazyload';
import { themeSettings, text } from '../../lib/settings';
import * as helper from '../../lib/helper';

const ItemImage = ({ images, productName, height }) => {
	if (images && images.length > 0) {
		const image = images[0];
		const imageUrl = helper.getThumbnailUrl(
			image.url,
			themeSettings.listThumbnailWidth
		);
		const alt = image.alt && image.alt.length > 0 ? image.alt : productName;

		return (
			<LazyLoad height={height}>
				<img src={imageUrl} alt={alt} title={alt} />
			</LazyLoad>
		);
	}
	return <div style={{ height }} className="small-image-placeholder" />;
};

export default ItemImage;
