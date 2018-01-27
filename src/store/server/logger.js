const winston = require('winston');
const LOGS_FILE = 'logs/server.log';

winston.configure({
  transports: [
    new (winston.transports.Console)({
      colorize: true
    }),
    new (winston.transports.File)({
      filename: LOGS_FILE,
      handleExceptions: true
    })
  ]
});
