import fs from 'fs';
import path from 'path';
import lruCache from 'lru-cache';
import serverSettings from '../../lib/settings';

const cache = lruCache({
	max: 10000,
	maxAge: 1000 * 60 * 60 * 24 // 24h
});

const THEME_SETTINGS_CACHE_KEY = 'themesettings';
const SETTINGS_FILE = path.resolve('theme/settings/settings.json');
const SETTINGS_SCHEMA_FILE = path.resolve(
	`theme/settings/${serverSettings.language}.json`
);
const SETTINGS_SCHEMA_FILE_EN = path.resolve('theme/settings/en.json');

class ThemeSettingsService {
	constructor() {}

	readFile(file) {
		return new Promise((resolve, reject) => {
			fs.readFile(file, 'utf8', (err, data) => {
				if (err) {
					reject(err);
				} else {
					let jsonData = {};
					try {
						jsonData = data.length > 0 ? JSON.parse(data) : {};
						resolve(jsonData);
					} catch (e) {
						reject('Failed to parse JSON');
					}
				}
			});
		});
	}

	writeFile(file, jsonData) {
		return new Promise((resolve, reject) => {
			const stringData = JSON.stringify(jsonData);
			fs.writeFile(file, stringData, err => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	getSettingsSchema() {
		if (fs.existsSync(SETTINGS_SCHEMA_FILE)) {
			return this.readFile(SETTINGS_SCHEMA_FILE);
		}

		// If current locale not exist, use scheme in English
		return this.readFile(SETTINGS_SCHEMA_FILE_EN);
	}

	getSettings() {
		const settingsFromCache = cache.get(THEME_SETTINGS_CACHE_KEY);

		if (settingsFromCache) {
			return Promise.resolve(settingsFromCache);
		}
		return this.readFile(SETTINGS_FILE).then(settings => {
			cache.set(THEME_SETTINGS_CACHE_KEY, settings);
			return settings;
		});
	}

	updateSettings(settings) {
		cache.set(THEME_SETTINGS_CACHE_KEY, settings);
		return this.writeFile(SETTINGS_FILE, settings);
	}
}

export default new ThemeSettingsService();
