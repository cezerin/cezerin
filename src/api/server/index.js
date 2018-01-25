const express = require('express');
const app = express();
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const responseTime = require('response-time');
const winston = require('winston');
const settings = require('./lib/settings');
const security = require('./lib/security');
const mongo = require('./lib/mongo');
const dashboardEvents = require('./lib/events');
const ajaxRouter = require('./ajaxRouter');
const apiRouter = require('./apiRouter');

winston.configure({
  transports: [
    new (winston.transports.Console)({
      colorize: true
    }),
    new (winston.transports.File)({
      filename: 'logs/server.log',
      handleExceptions: true
    })
  ]
});

const logErrors = (err, req, res, next) => {
  if(err && err.name === 'UnauthorizedError') {
    res.status(401).send({'error': true, 'message': err.message.toString()});
  } else if(err) {
    winston.error('API error', err);
    res.status(500).send({'error': true, 'message': err.toString()});
  } else {
    next();
  }
};

security.applyMiddleware(app);
app.set('trust proxy', 1);
app.use(helmet());
app.all('*', (req, res, next) => {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Key, Authorization');
  next();
});
app.use(responseTime());
app.use(cookieParser(settings.cookieSecretKey));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.get('/dashboard/events', (req, res, next) => {
  dashboardEvents.subscribe(req, res);
});
app.use('/ajax', ajaxRouter);
app.use('/api', apiRouter);
app.use(logErrors);

const server = app.listen(settings.apiListenPort, () => {
  const serverAddress = server.address();
  winston.info(`API running at http://${serverAddress.address}:${serverAddress.port}`);
});
