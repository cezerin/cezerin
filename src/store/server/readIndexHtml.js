import fs from 'fs';
import path from 'path';
import winston from 'winston';

const FILE_PATH = path.resolve('theme/assets/index.html');
export let indexHtml = null;

fs.readFile(FILE_PATH, 'utf8', (err, data) => {
	if (err) {
		indexHtml = '';
		winston.error('Fail to read file', FILE_PATH, err);
	} else {
		indexHtml = data;
	}
});
