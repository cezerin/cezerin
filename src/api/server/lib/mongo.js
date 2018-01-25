const settings = require('./settings');
const winston = require('winston');
const mongo = require('mongodb').MongoClient;
const mongodbConnection = settings.mongodbServerUrl;

const CONNECT_OPTIONS = {
  reconnectTries: 3600,
  reconnectInterval: 1000
}

mongo.connect(mongodbConnection, CONNECT_OPTIONS, (err, client) => {
  if(err){
    winston.error('Failed connecting to MongoDB', err.message);
  } else {
    module.exports.db = client.db('shop');
    winston.info('Successfully connected to MongoDB')
  }
});
