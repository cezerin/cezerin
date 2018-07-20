export const formatNumber = (number = 0, settings) => {
	const x = 3;

	const re =
		'\\d(?=(\\d{' +
		x +
		'})+' +
		(settings.decimal_number > 0 ? '\\D' : '$') +
		')';

	let num = (number || 0).toFixed(Math.max(0, ~~settings.decimal_number));

	return (settings.decimal_separator
		? num.replace('.', settings.decimal_separator)
		: num
	).replace(new RegExp(re, 'g'), '$&' + settings.thousand_separator);
};

const amountPattern = '{amount}';
export const formatCurrency = (number = 0, settings) => {
	return settings.currency_format.replace(
		amountPattern,
		formatNumber(number, settings)
	);
};

export const getThumbnailUrl = (originalUrl, width) => {
	if (originalUrl && originalUrl.length > 0) {
		const pos = originalUrl.lastIndexOf('/');
		const thumbnailUrl =
			originalUrl.substring(0, pos) +
			`/${width}/` +
			originalUrl.substring(pos + 1);
		return thumbnailUrl;
	} else {
		return '';
	}
};

export const getParentIds = (categories, categoryId) => {
	let parentIds = [];
	let parentExists = false;

	do {
		const category = categories.find(item => item.id === categoryId);
		parentExists = category && category.parent_id;
		if (parentExists) {
			parentIds.push(category.parent_id);
			categoryId = category.parent_id;
		}
	} while (parentExists);

	return parentIds;
};
