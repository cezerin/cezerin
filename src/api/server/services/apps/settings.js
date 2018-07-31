import { db } from '../../lib/mongo';
import parse from '../../lib/parse';

class AppSettingsService {
	constructor() {}

	getSettings(appKey) {
		return db
			.collection('appSettings')
			.findOne({ key: appKey }, { _id: 0, key: 0 });
	}

	updateSettings(appKey, data) {
		if (Object.keys(data).length === 0) {
			return new Error('Required fields are missing');
		}

		delete data.key;

		return db
			.collection('appSettings')
			.updateOne(
				{ key: appKey },
				{
					$set: data
				},
				{ upsert: true }
			)
			.then(res => this.getSettings(appKey));
	}
}

export default new AppSettingsService();
