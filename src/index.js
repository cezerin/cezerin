var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var apiRouter = require('./api/server');
var storeRouter = require('./store/server');
var ajaxRouter = require('./store/server/ajax');
var responseTime = require('response-time');

app.disable('x-powered-by');
app.use(responseTime())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/api/v1', apiRouter);
app.use('/ajax', ajaxRouter);
app.use('/', storeRouter);

const server = app.listen(3000, () => {
  var host = server.address().address;
  host = (host === '::' ? 'localhost' : host);
  var port = server.address().port;
  console.log(`${new Date()} - server start at ${host}:${port}`);
});
