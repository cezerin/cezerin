const settings = require('./settings');
const winston = require('winston');
const MongoClient = require('mongodb').MongoClient;

const mongodbConnection = settings.mongodbServerUrl;
const lastslashindex = mongodbConnection.lastIndexOf('/');
const dbName = mongodbConnection.substring(lastslashindex  + 1);

const RECONNECT_INTERVAL = 1000;
const CONNECT_OPTIONS = {
  reconnectTries: 3600,
  reconnectInterval: RECONNECT_INTERVAL
}

const onClose = () => {
  winston.info('MongoDB connection was closed');
}

const onReconnect = () => {
  winston.info('MongoDB reconnected');
}

const connectWithRetry = () => {
  MongoClient.connect(mongodbConnection, CONNECT_OPTIONS, (err, client) => {
    if(err){
      winston.error('MongoDB connection was failed:', err.message);
      setTimeout(connectWithRetry, RECONNECT_INTERVAL);
    } else {
      const db = client.db(dbName);
      db.on('close', onClose);
      db.on('reconnect', onReconnect);
      module.exports.db = db;
      winston.info('MongoDB connected successfully');
    }
  });
};

connectWithRetry();
