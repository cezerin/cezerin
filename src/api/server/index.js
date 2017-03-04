var expressJwt = require('express-jwt');
var express = require('express');
var apiRouter = express.Router();

var settings = require('./lib/settings');
var mongo = require('./lib/mongo');

const SecurityTokensService = require('./services/security/tokens');
const ProductСategoriesController = require('./controllers/product_categories');
const ProductsController = require('./controllers/products');
const SitemapController = require('./controllers/sitemap');
const ThemesController = require('./controllers/themes');
const CustomersController = require('./controllers/customers');
const CustomerGroupsController = require('./controllers/customer_groups');
const OrdersController = require('./controllers/orders');
const OrderStatusesController = require('./controllers/order_statuses');
const ShippingMethodsController = require('./controllers/shipping_methods');
const PaymentMethodsController = require('./controllers/payment_methods');
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
    }).catch(err => done(err, setTokenAsRevokenOnException));
  } catch (e) {
    done('Can\'t connect to database', setTokenAsRevokenOnException);
  }
};

apiRouter.use(expressJwt({secret: settings.security.jwtSecret, isRevoked: checkTokenInBlacklistCallback}).unless({path: [`/api/v1/authorize`]}));

var products = new ProductsController(apiRouter);
var product_categories = new ProductСategoriesController(apiRouter);
var sitemap = new SitemapController(apiRouter);
var themes = new ThemesController(apiRouter);
var customers = new CustomersController(apiRouter);
var customer_groups = new CustomerGroupsController(apiRouter);
var orders = new OrdersController(apiRouter);
var order_statuses = new OrderStatusesController(apiRouter);
var shipping_methods = new ShippingMethodsController(apiRouter);
var payment_methods = new PaymentMethodsController(apiRouter);
var data = new DataController(apiRouter);
var settings = new SettingsController(apiRouter);
var pages = new PagesController(apiRouter);
var security = new SecurityTokensController(apiRouter);

apiRouter.use((err, req, res, next) => {
  if(err && err.name === 'UnauthorizedError') {
    res.status(401).send({'error': true, 'message': err.message.toString()});
  } else if(err) {
    res.status(500).send({'error': true, 'message': err.toString()});
  } else {
    next();
  }
});

apiRouter.all('*', (req, res, next) => {
  res.status(405).send({'error': true, 'message': 'Method Not Allowed'});
})

mongo.connect().then(() => {
  console.log(`${new Date()} - Successfully connected to MongoDB`)
}).catch(err => {
  console.log(`${new Date()} - Failed connecting to MongoDB: ${err.message}\n`);
});

module.exports = apiRouter;
