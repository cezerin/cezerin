var redis = require('redis');
var client = redis.createClient(6379, 'localhost', { auth_pass: '-' });
client.auth('-');
module.exports = client;
