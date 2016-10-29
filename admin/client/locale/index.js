// This is essentially bulk require
var req = require.context('./', true, /\.json.*$/);
var messages = {};
var locales = [];

req.keys().forEach(function (file) {
  var locale = file.replace('./', '').replace('.json', '');
  locales.push(locale);
  messages[locale] = req(file);
});

var currentLocale = navigator.language.split('-')[0];
if(!locales.includes(currentLocale)) {
  currentLocale = 'en';
}

module.exports = Object.assign({}, messages[currentLocale], { locale: currentLocale });
