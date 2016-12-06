var settings = require('./settings');
var mongo = require('mongodb').MongoClient;
var mongodbConnection = settings.server.mongodb;
var db;

// Initialize connection once
function connect(callback){
  mongo.connect(mongodbConnection, function(err, database) {
      if(err){
        throw err;
      }
      module.exports.db = db = database;
      callback();
  });
}

module.exports = {
  connect: connect
};
