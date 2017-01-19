var expressJwt = require('express-jwt');
var express = require('express');
var apiRouter = express.Router();

var settings = require('./lib/settings');
var auth = require('./lib/auth');
var mongo = require('./lib/mongo');
var utils = require('./lib/utils');

const ProductСategoriesController = require('./controllers/products/product_categories');
const ProductsController = require('./controllers/products/products');
const SitemapController = require('./controllers/sitemap');
const ThemesController = require('./controllers/themes/themes');
const CustomersController = require('./controllers/customers/customers');
const CustomerGroupsController = require('./controllers/customers/customer_groups');
const OrdersController = require('./controllers/orders/orders');
const OrderStatusesController = require('./controllers/orders/order_statuses');
const ShippingMethodsController = require('./controllers/orders/shipping_methods');
const PaymentMethodsController = require('./controllers/orders/payment_methods');

apiRouter.all('/*', function(req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Key, Authorization');
  next();
});

apiRouter.use(expressJwt({ secret: settings.security.jwtSecret}).unless({path: [`${settings.api.baseUrl}/authorize`]}));
apiRouter.post('/authorize', auth.login);

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

// apiRouter.use(function(err, req, res, next) {
//   if(err && err.name === 'UnauthorizedError') {
//     res.status(401).send({ 'error': err.message });
//   } else if(err) {
//     res.status(500).send({ 'error': err });
//   } else {
//     next();
//   }
// });

apiRouter.all('*', (req, res, next) => {
  res.status(405).send({ 'error': 'Method Not Allowed' });
})

mongo.connect(() => {});

module.exports = apiRouter;
