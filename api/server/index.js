var parser = require('accept-language-parser');
var expressJwt = require('express-jwt');
var express = require('express');
var apiRouter = express.Router();

var settings = require('./lib/settings');
var auth = require('./lib/auth');
var mongo = require('./lib/mongo');
var utils = require('./lib/utils');

const СategoriesController = require('./controllers/products/categories');
const SitemapController = require('./controllers/sitemap');

apiRouter.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Key, Authorization');

  // Set main language from first in Header 'Accept-Language'
  try {
    var languages = parser.parse(req.get('accept-language'));
    req.app.locals.language = languages[0].code;
    next();
  }
  catch (e) {
    res.status(400).send({ 'error': 'Accept-Language header missing or not correct' });
  }
});

apiRouter.use(expressJwt({ secret: settings.security.jwtSecret}).unless({path: ['/api/authorize']}));
apiRouter.post('/authorize', auth.login);
var cat = new СategoriesController(apiRouter);
var sitemap = new SitemapController(apiRouter);

apiRouter.use(function(err, req, res, next) {
  if(err && err.name === 'UnauthorizedError') {
    res.status(401).send({ 'error': err.message });
  } else if(err) {
    res.status(500).send({ 'error': err });
  } else {
    next();
  }
});

mongo.connect(() => {});

module.exports = apiRouter;
