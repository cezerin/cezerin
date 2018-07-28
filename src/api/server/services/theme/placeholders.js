import { db } from '../../lib/mongo';
import parse from '../../lib/parse';

class ThemePlaceholdersService {
	constructor() {}

	getPlaceholders() {
		return db
			.collection('themePlaceholders')
			.find({}, { _id: 0 })
			.toArray();
	}

	getSinglePlaceholder(placeholderKey) {
		return db
			.collection('themePlaceholders')
			.findOne({ key: placeholderKey }, { _id: 0 });
	}

	addPlaceholder(data) {
		const field = this.getValidDocumentForInsert(data);
		const placeholderKey = field.key;

		return this.getSinglePlaceholder(placeholderKey).then(placeholder => {
			if (placeholder) {
				// placeholder exists
				return new Error('Placeholder exists');
			} else {
				// add
				return db
					.collection('themePlaceholders')
					.insertOne(field)
					.then(res => this.getSinglePlaceholder(placeholderKey));
			}
		});
	}

	updatePlaceholder(placeholderKey, data) {
		const field = this.getValidDocumentForUpdate(data);
		return db
			.collection('themePlaceholders')
			.updateOne(
				{ key: placeholderKey },
				{
					$set: field
				},
				{ upsert: true }
			)
			.then(res => this.getSinglePlaceholder(placeholderKey));
	}

	deletePlaceholder(placeholderKey) {
		return db
			.collection('themePlaceholders')
			.deleteOne({ key: placeholderKey });
	}

	getValidDocumentForUpdate(data) {
		if (Object.keys(data).length === 0) {
			return new Error('Required fields are missing');
		}

		let field = {};

		if (data.place !== undefined) {
			field.place = parse.getString(data.place);
		}

		if (data.value !== undefined) {
			field.value = parse.getString(data.value);
		}

		return field;
	}

	getValidDocumentForInsert(data) {
		if (Object.keys(data).length === 0) {
			return new Error('Required fields are missing');
		}

		let field = {};

		if (data.key !== undefined) {
			field.key = parse.getString(data.key);
		}

		if (data.place !== undefined) {
			field.place = parse.getString(data.place);
		}

		if (data.value !== undefined) {
			field.value = parse.getString(data.value);
		}

		return field;
	}
}

export default new ThemePlaceholdersService();
