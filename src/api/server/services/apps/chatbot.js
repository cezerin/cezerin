'use strict';

const mongo = require('../../lib/mongo');
const parse = require('../../lib/parse');
const dialogflow = require('dialogflow');

class ChatbotService {
	constructor() {}

	getSettings() {
		return mongo.db
			.collection('appSettings')
			.findOne({ key: 'ubot-chatbot' }, { _id: 0, key: 0 });
	}

	ask(projectId, sessionId, question) {
		console.log('projectId:', projectId);
		console.log('sessionId:', sessionId);
		console.log('question:', question);
	}
}

module.exports = new ChatbotService();
