var yaml = require('js-yaml');
var settings = null;

var request = new XMLHttpRequest();
request.open('GET', '/admin/assets/js/config/settings.yml', false);
request.send();

if (request.status === 200) {
  settings = yaml.safeLoad(request.responseText);
}

export default settings
