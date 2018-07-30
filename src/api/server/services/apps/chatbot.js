'use strict';

const mongo = require('../../lib/mongo');
const parse = require('../../lib/parse');

class ChatbotSettingsService {
	constructor() {}

	getSettings() {
		return mongo.db
			.collection('appSettings')
			.findOne({ key: 'ubot-chatbot' }, { _id: 0, key: 0 });
	}
}

module.exports = new ChatbotSettingsService();
