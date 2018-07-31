import { db } from '../../lib/mongo';
import parse from '../../lib/parse';

class EmailSettingsService {
	constructor() {
		this.defaultSettings = {
			host: '',
			port: '',
			user: '',
			pass: 0,
			from_name: '',
			from_address: ''
		};
	}

	getEmailSettings() {
		return db
			.collection('emailSettings')
			.findOne()
			.then(settings => {
				return this.changeProperties(settings);
			});
	}

	updateEmailSettings(data) {
		const settings = this.getValidDocumentForUpdate(data);
		return this.insertDefaultSettingsIfEmpty().then(() =>
			db
				.collection('emailSettings')
				.updateOne(
					{},
					{
						$set: settings
					},
					{ upsert: true }
				)
				.then(res => this.getEmailSettings())
		);
	}

	insertDefaultSettingsIfEmpty() {
		return db
			.collection('emailSettings')
			.countDocuments({})
			.then(count => {
				if (count === 0) {
					return db.collection('emailSettings').insertOne(this.defaultSettings);
				} else {
					return;
				}
			});
	}

	getValidDocumentForUpdate(data) {
		if (Object.keys(data).length === 0) {
			return new Error('Required fields are missing');
		}

		let settings = {};

		if (data.host !== undefined) {
			settings.host = parse.getString(data.host).toLowerCase();
		}

		if (data.port !== undefined) {
			settings.port = parse.getNumberIfPositive(data.port);
		}

		if (data.user !== undefined) {
			settings.user = parse.getString(data.user);
		}

		if (data.pass !== undefined) {
			settings.pass = parse.getString(data.pass);
		}

		if (data.from_name !== undefined) {
			settings.from_name = parse.getString(data.from_name);
		}

		if (data.from_address !== undefined) {
			settings.from_address = parse.getString(data.from_address);
		}

		return settings;
	}

	changeProperties(settings) {
		if (settings) {
			delete settings._id;
		} else {
			return this.defaultSettings;
		}

		return settings;
	}
}

export default new EmailSettingsService();
