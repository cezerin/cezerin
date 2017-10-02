export let themeSettings = {};
export let text = {};

// Client - from Redux state
if(typeof window !== 'undefined'){
  const appText = window.__APP_TEXT__;
  const appState = window.__APP_STATE__;

  if(appState.app.themeSettings){
    themeSettings = appState.app.themeSettings;
  }

  if(appText){
    text = appText;
  }
}

// Server - from render page method
export const updateThemeSettings = options => {
  themeSettings = options.settings;
  text = options.text;
}
