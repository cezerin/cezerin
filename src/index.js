const express = require('express');
const app = express();
const helmet = require('helmet')
const bodyParser = require('body-parser');
const apiRouter = require('./api/server');
const ajaxRouter = require('./store/server/ajax');
const storeRouter = require('./store/server');
const responseTime = require('response-time');
const settings = require('../config/server');
const path = require('path');
const cookieParser = require('cookie-parser');
const winston = require('winston');

const STATIC_ROOT_DIRECTORY = 'public';
const ADMIN_INDEX_PATH = path.join(__dirname, '../public/admin/index.html');

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
  if(err) {
    winston.error('Server error', err);
    res.status(500).send(err);
  } else {
    next();
  }
}

const staticOptions = {
  maxAge: 31536000000 // One year
}

app.set('trust proxy', 1) // trust first proxy
app.use(express.static(STATIC_ROOT_DIRECTORY, staticOptions))
app.get('/*.ico', (req, res) => {
  res.status(404).end();
});
app.get('/assets/*', (req, res) => {
  res.status(404).end();
});
app.use(helmet())
app.use(responseTime())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api', apiRouter);
app.get('/admin/*', (req, res) => {
  res.sendFile(ADMIN_INDEX_PATH)
});
app.use(cookieParser(settings.cookieSecretKey));
app.use('/ajax', ajaxRouter);
app.use('/', storeRouter);
app.use(logErrors);

const server = app.listen(settings.nodeServerPort, settings.nodeServerHost, () => {
  winston.info(`Server start at http://${settings.nodeServerHost}:${settings.nodeServerPort}`)
});
