import { db } from '../../lib/mongo';
import parse from '../../lib/parse';

class EmailTemplatesService {
	constructor() {}

	getEmailTemplate(name) {
		return db
			.collection('emailTemplates')
			.findOne({ name: name })
			.then(template => {
				return this.changeProperties(template);
			});
	}

	updateEmailTemplate(name, data) {
		const template = this.getValidDocumentForUpdate(data);
		return db
			.collection('emailTemplates')
			.updateOne(
				{ name: name },
				{
					$set: template
				},
				{ upsert: true }
			)
			.then(res => this.getEmailTemplate(name));
	}

	getValidDocumentForUpdate(data) {
		if (Object.keys(data).length === 0) {
			return new Error('Required fields are missing');
		}

		let template = {};

		if (data.subject !== undefined) {
			template.subject = parse.getString(data.subject);
		}

		if (data.body !== undefined) {
			template.body = parse.getString(data.body);
		}

		return template;
	}

	changeProperties(template) {
		if (template) {
			delete template._id;
			delete template.name;
		} else {
			return {
				subject: '',
				body: ''
			};
		}

		return template;
	}
}

export default new EmailTemplatesService();
