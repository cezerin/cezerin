export let themeSettings = null;
export let text = null;
export let language = null;
export let api = null;

const setVariables = options => {
	if (options.themeSettings) {
		({ themeSettings } = options);
	}

	if (options.text) {
		({ text } = options);
	}

	if (options.language) {
		({ language } = options);
	}

	if (options.api) {
		({ api } = options);
	}
};

export const initOnClient = options => {
	setVariables(options);
};

export const initOnServer = options => {
	setVariables(options);
};
