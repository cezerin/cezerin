var settings = require('./settings');
var mongo = require('mongodb').MongoClient;
var mongodbConnection = settings.server.mongodb;
var db;

// Initialize connection once
const connect = () => {
  return new Promise((resolve, reject) => {
    mongo.connect(mongodbConnection, (err, database) => {
        if(err){
          reject(err)
        } else {
          module.exports.db = db = database;
          resolve();
        }
    });
  })
}

module.exports = {
  connect: connect
};
