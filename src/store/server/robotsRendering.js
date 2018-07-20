import fs from 'fs';
import path from 'path';
import api from './api';

const ROBOTS_TEMPLATE_PATH = 'public/robots.template';

const robotsRendering = (req, res) => {
	api.settings.retrieve().then(settingsResponse => {
		fs.readFile(path.resolve(ROBOTS_TEMPLATE_PATH), 'utf8', (err, data) => {
			if (err) {
				res.status(500).end();
			} else {
				const robots = data.replace(/{domain}/g, settingsResponse.json.domain);
				res.header('Content-Type', 'text/plain');
				res.send(robots);
			}
		});
	});
};

export default robotsRendering;
