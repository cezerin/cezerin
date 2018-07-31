export let themeSettings = null;
export let text = null;
export let language = null;
export let api = null;

const setVariables = options => {
	if (options.themeSettings) {
		themeSettings = options.themeSettings;
	}

	if (options.text) {
		text = options.text;
	}

	if (options.language) {
		language = options.language;
	}

	if (options.api) {
		api = options.api;
	}
};

export const initOnClient = options => {
	setVariables(options);
};

export const initOnServer = options => {
	setVariables(options);
};
