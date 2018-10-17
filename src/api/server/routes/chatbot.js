import security from '../lib/security';
import ChatbotService from '../services/apps/chatbot';

class ChatbotRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.post('/v1/chatbot/ask', this.askQuestion.bind(this));
	}

	async askQuestion(req, res, next) {
		const { projectId, sessionId, question } = req.body;
		try {
			const answer = await ChatbotService.ask(projectId, sessionId, question);
			res.status(200).send({ status: 200, answer });
		} catch (error) {
			console.log('Error getting answer from service:', error.message);
			res.status(500).end();
		}
	}
}

export default ChatbotRoute;
