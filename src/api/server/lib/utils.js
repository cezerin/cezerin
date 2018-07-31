import slug from 'slug';
import SitemapService from '../services/sitemap';

const slugConfig = {
	symbols: false, // replace unicode symbols or not
	remove: null, // (optional) regex to remove characters
	lower: true // result in lower case
};

const cleanSlug = text => {
	return slug(text || '', slugConfig);
};

const getAvailableSlug = (path, resource, enableCleanPath = true) => {
	return SitemapService.getPaths().then(paths => {
		if (enableCleanPath) {
			path = cleanSlug(path);
		}

		let pathExists = paths.find(
			e => e.path === '/' + path && e.resource != resource
		);
		while (pathExists) {
			path += '-2';
			pathExists = paths.find(
				e => e.path === '/' + path && e.resource != resource
			);
		}
		return path;
	});
};

const getCorrectFileName = filename => {
	if (filename) {
		// replace unsafe characters
		return filename.replace(/[\s*/:;&?@$()<>#%\{\}|\\\^\~\[\]]/g, '-');
	} else {
		return filename;
	}
};

const getProjectionFromFields = fields => {
	const fieldsArray = fields && fields.length > 0 ? fields.split(',') : [];
	return Object.assign({}, ...fieldsArray.map(key => ({ [key]: 1 })));
};

export default {
	cleanSlug: cleanSlug,
	getAvailableSlug: getAvailableSlug,
	getCorrectFileName: getCorrectFileName,
	getProjectionFromFields: getProjectionFromFields
};
