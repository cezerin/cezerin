var express = require('express');
var app = express();
var helmet = require('helmet')
var bodyParser = require('body-parser');
var apiRouter = require('./api/server');
var storeRouter = require('./store/server');
var ajaxRouter = require('./store/server/ajax');
var responseTime = require('response-time');
var settings = require('../config/server');
var path = require('path');
var cookieParser = require('cookie-parser');

app.set('trust proxy', 1) // trust first proxy
app.use(express.static('public'))
app.use(helmet())
app.use(responseTime())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api/v1', apiRouter);
app.get('/admin/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/admin/index.html'))
});
app.use(cookieParser(settings.security.cookieKey));
app.use('/ajax', ajaxRouter);
app.use('/', storeRouter);

const server = app.listen(settings.nodeServerPort, () => {
  var host = server.address().address;
  host = (host === '::'
    ? 'localhost'
    : host);
  var port = server.address().port;
  console.log(`${new Date()} - server start at ${host}:${port}`);
});
