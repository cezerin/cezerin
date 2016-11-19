var jwt = require('jsonwebtoken');
var auth = require('basic-auth');
const settings = require('./settings');

const user = {
  username: 'demo@demo.com',
  password: 'demo'
};

function login(req, res) {
  var credentials = auth(req);

  if (credentials && credentials.name === user.username && credentials.pass === user.password) {
    const token = jwt.sign({ username: user.username }, settings.security.jwtSecret);
    return res.send({ token });
  }

  res.status(401).send({ 'error': true, 'message': 'Invalid credentials' });
}

module.exports = {
  login: login
}
