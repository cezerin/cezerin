import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

const MetaTags = ({
	title = null,
	description,
	canonicalUrl,
	imageUrl,
	ogType,
	ogTitle,
	ogDescription,
	jsonld
}) => {
	const metaArray = [];
	const linkArray = [];

	if (description && description.length > 0) {
		metaArray.push({
			name: 'description',
			content: description
		});
	}

	if (canonicalUrl && canonicalUrl.length > 0) {
		linkArray.push({
			rel: 'canonical',
			href: canonicalUrl
		});

		metaArray.push({
			property: 'og:url',
			content: canonicalUrl
		});
	}

	if (imageUrl && imageUrl.length > 0) {
		metaArray.push({
			property: 'og:image',
			content: imageUrl
		});

		linkArray.push({
			rel: 'image_src',
			href: imageUrl
		});
	}

	if (ogType && ogType.length > 0) {
		metaArray.push({
			property: 'og:type',
			content: ogType
		});
	}

	if (ogTitle && ogTitle.length > 0) {
		metaArray.push({
			property: 'og:title',
			content: ogTitle
		});
	}

	if (ogDescription && ogDescription.length > 0) {
		metaArray.push({
			property: 'og:description',
			content: ogDescription
		});
	}

	const scriptJSONLD =
		jsonld && jsonld.length > 0 ? (
			<script type="application/ld+json">{jsonld}</script>
		) : null;

	return (
		<Helmet title={title} meta={metaArray} link={linkArray}>
			{scriptJSONLD}
		</Helmet>
	);
};

MetaTags.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	canonicalUrl: PropTypes.string,
	imageUrl: PropTypes.string,
	ogType: PropTypes.string,
	ogTitle: PropTypes.string,
	ogDescription: PropTypes.string,
	jsonld: PropTypes.string
};

MetaTags.defaultProps = {
	title: null,
	description: null,
	canonicalUrl: null,
	imageUrl: null,
	ogType: null,
	ogTitle: null,
	ogDescription: null,
	jsonld: null
};

export default MetaTags;
