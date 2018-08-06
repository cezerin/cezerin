import security from '../lib/security';
import ChatbotService from '../services/apps/chatbot';

class ChatbotRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.post(
			'/v1/chatbot/ask/:sessionId/:question',
			this.askQuestion.bind(this)
		);
	}

	askQuestion(req, res, next) {
		console.log('req.params.question:', req.params.question, '\n');
		console.log('req.params.sessionId:', req.params.sessionId, '\n');
		ChatbotService.askQuestion(req.params.question, req.params.sessionId);
	}
}

export default ChatbotRoute;
