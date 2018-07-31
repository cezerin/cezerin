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

	askQuestion(question, sessionId) {
		console.log('question received!');
		console.log('question:', question, '\n');
		console.log('sessionId:', sessionId, '\n');
	}
}

module.exports = new ChatbotService();
