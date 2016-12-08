var yaml = require('js-yaml');
var fs   = require('fs');
var path = require('path');

const filePath = path.resolve('config/api.yml');
const settings = yaml.safeLoad(fs.readFileSync(filePath), 'utf8');
module.exports = settings;
