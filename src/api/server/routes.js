'use strict';

const express = require('express');
const apiRouter = express.Router();

const SecurityTokensService = require('./services/security/tokens');
const ProductCategoriesController = require('./controllers/productCategories');
const ProductsController = require('./controllers/products');
const SitemapController = require('./controllers/sitemap');
const ThemeController = require('./controllers/theme');
const CustomersController = require('./controllers/customers');
const CustomerGroupsController = require('./controllers/customerGroups');
const OrdersController = require('./controllers/orders');
const OrderStatusesController = require('./controllers/orderStatuses');
const ShippingMethodsController = require('./controllers/shippingMethods');
const PaymentMethodsController = require('./controllers/paymentMethods');
const PaymentGatewaysController = require('./controllers/paymentGateways');
const DataController = require('./controllers/data');
const SettingsController = require('./controllers/settings');
const PagesController = require('./controllers/pages');
const SecurityTokensController = require('./controllers/tokens');
const NotificationsController = require('./controllers/notifications');
const RedirectsController = require('./controllers/redirects');
const FilesController = require('./controllers/files');
const AppsController = require('./controllers/apps');

new ProductsController(apiRouter);
new ProductCategoriesController(apiRouter);
new SitemapController(apiRouter);
new ThemeController(apiRouter);
new CustomersController(apiRouter);
new CustomerGroupsController(apiRouter);
new OrdersController(apiRouter);
new OrderStatusesController(apiRouter);
new ShippingMethodsController(apiRouter);
new PaymentMethodsController(apiRouter);
new PaymentGatewaysController(apiRouter);
new DataController(apiRouter);
new SettingsController(apiRouter);
new PagesController(apiRouter);
new SecurityTokensController(apiRouter);
new NotificationsController(apiRouter);
new RedirectsController(apiRouter);
new FilesController(apiRouter);
new AppsController(apiRouter);

module.exports = apiRouter;
