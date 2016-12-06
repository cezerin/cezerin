var yaml = require('js-yaml');
var fs   = require('fs');
var path = require('path');

// const settings = yaml.safeLoad(fs.readFileSync('../config/settings.yml', 'utf8'));
const settings = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname,  '../../../../config/api.yml')), 'utf8');
module.exports = settings;
