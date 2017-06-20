var expressJwt = require('express-jwt');
var winston = require('winston');
var express = require('express');
var apiRouter = express.Router();

var settings = require('./lib/settings');
var mongo = require('./lib/mongo');
var dashboardEvents = require('./lib/events');

const SecurityTokensService = require('./services/security/tokens');
const ProductCategoriesController = require('./controllers/productCategories');
const ProductsController = require('./controllers/products');
const SitemapController = require('./controllers/sitemap');
const ThemesController = require('./controllers/themes');
const CustomersController = require('./controllers/customers');
const CustomerGroupsController = require('./controllers/customerGroups');
const OrdersController = require('./controllers/orders');
const OrderStatusesController = require('./controllers/orderStatuses');
const ShippingMethodsController = require('./controllers/shippingMethods');
const PaymentMethodsController = require('./controllers/paymentMethods');
const DataController = require('./controllers/data');
const SettingsController = require('./controllers/settings');
const PagesController = require('./controllers/pages');
const SecurityTokensController = require('./controllers/tokens');

apiRouter.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Key, Authorization');
  next();
});

const setTokenAsRevokenOnException = true;
const checkTokenInBlacklistCallback = (req, payload, done) => {
  var jti = payload.jti;
  try {
    SecurityTokensService.getTokensBlacklist().then(blacklist => {
      const tokenIsRevoked = blacklist.includes(jti);
      return done(null, tokenIsRevoked);
    }).catch(err => {
      done(err, setTokenAsRevokenOnException);
    });
  } catch (e) {
    done('Can\'t connect to database', setTokenAsRevokenOnException);
  }
};

apiRouter.use(expressJwt({secret: settings.jwtSecretKey, isRevoked: checkTokenInBlacklistCallback}).unless({path: ['/api/v1/authorize', '/api/dashboard/events']}));

var products = new ProductsController(apiRouter);
var productCategories = new ProductCategoriesController(apiRouter);
var sitemap = new SitemapController(apiRouter);
var themes = new ThemesController(apiRouter);
var customers = new CustomersController(apiRouter);
var customerGroups = new CustomerGroupsController(apiRouter);
var orders = new OrdersController(apiRouter);
var orderStatuses = new OrderStatusesController(apiRouter);
var shippingMethods = new ShippingMethodsController(apiRouter);
var paymentMethods = new PaymentMethodsController(apiRouter);
var data = new DataController(apiRouter);
var settings = new SettingsController(apiRouter);
var pages = new PagesController(apiRouter);
var security = new SecurityTokensController(apiRouter);

apiRouter.get('/dashboard/events', function(req, res, next) {
  dashboardEvents.subscribe(req, res);
})

apiRouter.use((err, req, res, next) => {
  if(err && err.name === 'UnauthorizedError') {
    res.status(401).send({'error': true, 'message': err.message.toString()});
  } else if(err) {
    winston.error('API error', err);
    res.status(500).send({'error': true, 'message': err.toString()});
  } else {
    next();
  }
});

apiRouter.all('*', (req, res, next) => {
  res.status(405).send({'error': true, 'message': 'Method Not Allowed'});
})

module.exports = apiRouter;
