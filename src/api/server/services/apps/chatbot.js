'use strict';

const mongo = require('../../lib/mongo');
const parse = require('../../lib/parse');
const dialogflow = require('dialogflow');

class ChatbotService {
	constructor() {
		this.sessionsClient = new dialogflow.SessionsClient();
	}
	getSettings() {
		return mongo.db
			.collection('appSettings')
			.findOne({ key: 'ubot-chatbot' }, { _id: 0, key: 0 });
	}

	async ask(projectId, sessionId, question, locale = 'es-CL') {
		const session = this.sessionsClient.sessionPath(projectId, sessionId);
		const request = {
			session,
			queryInput: {
				text: {
					text: question,
					languageCode: locale
				}
			}
		};
		try {
			const responses = await this.sessionsClient.detectIntent(request);
			return responses[0].queryResult.fulfillmentText;
		} catch (error) {
			console.log('Error requesting dialogflow:', error.message);
		}
	}
}

module.exports = new ChatbotService();
