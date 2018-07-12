const winston = require('winston');
const LOGS_FILE = 'logs/server.log';

winston.configure({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: LOGS_FILE,
      handleExceptions: true
    })
  ]
});