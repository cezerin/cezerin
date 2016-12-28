var expressJwt = require('express-jwt');
var express = require('express');
var apiRouter = express.Router();

var settings = require('./lib/settings');
var auth = require('./lib/auth');
var mongo = require('./lib/mongo');
var utils = require('./lib/utils');

const ProductСategoriesController = require('./controllers/product_categories');
const ProductsController = require('./controllers/products');
const SitemapController = require('./controllers/sitemap');
const ThemesController = require('./controllers/themes');
const CustomersController = require('./controllers/customers');
const CustomerGroupsController = require('./controllers/customer_groups');

apiRouter.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Key, Authorization');
  next();
});

apiRouter.use(expressJwt({ secret: settings.security.jwtSecret}).unless({path: ['/api/authorize']}));
apiRouter.post('/authorize', auth.login);

var products = new ProductsController(apiRouter);
var product_categories = new ProductСategoriesController(apiRouter);
var sitemap = new SitemapController(apiRouter);
var themes = new ThemesController(apiRouter);
var customers = new CustomersController(apiRouter);
var customer_groups = new CustomerGroupsController(apiRouter);

apiRouter.use(function(err, req, res, next) {
  if(err && err.name === 'UnauthorizedError') {
    res.status(401).send({ 'error': err.message });
  } else if(err) {
    res.status(500).send({ 'error': err });
  } else {
    next();
  }
});

apiRouter.all('*', (req, res, next) => {
  res.status(405).send({ 'error': 'Method Not Allowed' });
})

mongo.connect(() => {});

module.exports = apiRouter;
