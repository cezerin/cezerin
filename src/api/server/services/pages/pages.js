import { ObjectID } from 'mongodb';
import url from 'url';
import settings from '../../lib/settings';
import { db } from '../../lib/mongo';
import utils from '../../lib/utils';
import parse from '../../lib/parse';
import SettingsService from '../settings/settings';

const DEFAULT_SORT = { is_system: -1, date_created: 1 };

class PagesService {
	constructor() {}

	getFilter(params = {}) {
		let filter = {};
		const id = parse.getObjectIDIfValid(params.id);
		const tags = parse.getString(params.tags);
		if (id) {
			filter._id = new ObjectID(id);
		}
		if (tags && tags.length > 0) {
			filter.tags = tags;
		}
		return filter;
	}

	getSortQuery({ sort }) {
		if (sort && sort.length > 0) {
			const fields = sort.split(',');
			return Object.assign(
				...fields.map(field => ({
					[field.startsWith('-') ? field.slice(1) : field]: field.startsWith(
						'-'
					)
						? -1
						: 1
				}))
			);
		} else {
			return DEFAULT_SORT;
		}
	}

	async getPages(params = {}) {
		const filter = this.getFilter(params);
		const sortQuery = this.getSortQuery(params);
		const projection = utils.getProjectionFromFields(params.fields);
		const generalSettings = await SettingsService.getSettings();
		const domain = generalSettings.domain;
		const items = await db
			.collection('pages')
			.find(filter, { projection: projection })
			.sort(sortQuery)
			.toArray();
		const result = items.map(page => this.changeProperties(page, domain));
		return result;
	}

	getSinglePage(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		return this.getPages({ id: id }).then(pages => {
			return pages.length > 0 ? pages[0] : null;
		});
	}

	addPage(data) {
		return this.getValidDocumentForInsert(data).then(page =>
			db
				.collection('pages')
				.insertMany([page])
				.then(res => this.getSinglePage(res.ops[0]._id.toString()))
		);
	}

	updatePage(id, data) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const pageObjectID = new ObjectID(id);

		return this.getValidDocumentForUpdate(id, data).then(page =>
			db
				.collection('pages')
				.updateOne({ _id: pageObjectID }, { $set: page })
				.then(res => this.getSinglePage(id))
		);
	}

	deletePage(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const pageObjectID = new ObjectID(id);
		return db
			.collection('pages')
			.deleteOne({ _id: pageObjectID, is_system: false })
			.then(deleteResponse => {
				return deleteResponse.deletedCount > 0;
			});
	}

	getValidDocumentForInsert(data) {
		let page = {
			is_system: false,
			date_created: new Date()
		};

		page.content = parse.getString(data.content);
		page.meta_description = parse.getString(data.meta_description);
		page.meta_title = parse.getString(data.meta_title);
		page.enabled = parse.getBooleanIfValid(data.enabled, true);
		page.tags = parse.getArrayIfValid(data.tags) || [];

		let slug =
			!data.slug || data.slug.length === 0 ? data.meta_title : data.slug;
		if (!slug || slug.length === 0) {
			return Promise.resolve(page);
		} else {
			return utils.getAvailableSlug(slug, null, false).then(newSlug => {
				page.slug = newSlug;
				return page;
			});
		}
	}

	getValidDocumentForUpdate(id, data) {
		if (Object.keys(data).length === 0) {
			return Promise.reject('Required fields are missing');
		} else {
			return this.getSinglePage(id).then(prevPageData => {
				let page = {
					date_updated: new Date()
				};

				if (data.content !== undefined) {
					page.content = parse.getString(data.content);
				}

				if (data.meta_description !== undefined) {
					page.meta_description = parse.getString(data.meta_description);
				}

				if (data.meta_title !== undefined) {
					page.meta_title = parse.getString(data.meta_title);
				}

				if (data.enabled !== undefined && !prevPageData.is_system) {
					page.enabled = parse.getBooleanIfValid(data.enabled, true);
				}

				if (data.tags !== undefined) {
					page.tags = parse.getArrayIfValid(data.tags) || [];
				}

				if (data.slug !== undefined && !prevPageData.is_system) {
					let slug = data.slug;
					if (!slug || slug.length === 0) {
						slug = data.meta_title;
					}

					return utils.getAvailableSlug(slug, id, false).then(newSlug => {
						page.slug = newSlug;
						return page;
					});
				} else {
					return page;
				}
			});
		}
	}

	changeProperties(item, domain) {
		if (item) {
			item.id = item._id.toString();
			item._id = undefined;

			if (!item.slug) {
				item.slug = '';
			}

			item.url = url.resolve(domain, `/${item.slug}`);
			item.path = url.resolve('/', item.slug);
		}

		return item;
	}
}

export default new PagesService();
