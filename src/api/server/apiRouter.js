'use strict';

const express = require('express');
const apiRouter = express.Router();

const ProductsRoute = require('./routes/products');
const ProductCategoriesRoute = require('./routes/productCategories');
const SitemapRoute = require('./routes/sitemap');
const ThemeRoute = require('./routes/theme');
const CustomersRoute = require('./routes/customers');
const CustomerGroupsRoute = require('./routes/customerGroups');
const OrdersRoute = require('./routes/orders');
const OrderStatusesRoute = require('./routes/orderStatuses');
const ShippingMethodsRoute = require('./routes/shippingMethods');
const PaymentMethodsRoute = require('./routes/paymentMethods');
const PaymentGatewaysRoute = require('./routes/paymentGateways');
const SettingsRoute = require('./routes/settings');
const PagesRoute = require('./routes/pages');
const SecurityTokensRoute = require('./routes/tokens');
const NotificationsRoute = require('./routes/notifications');
const RedirectsRoute = require('./routes/redirects');
const FilesRoute = require('./routes/files');
const AppsRoute = require('./routes/apps');
const WebhooksRoute = require('./routes/webhooks');

new ProductsRoute(apiRouter);
new ProductCategoriesRoute(apiRouter);
new SitemapRoute(apiRouter);
new ThemeRoute(apiRouter);
new CustomersRoute(apiRouter);
new CustomerGroupsRoute(apiRouter);
new OrdersRoute(apiRouter);
new OrderStatusesRoute(apiRouter);
new ShippingMethodsRoute(apiRouter);
new PaymentMethodsRoute(apiRouter);
new PaymentGatewaysRoute(apiRouter);
new SettingsRoute(apiRouter);
new PagesRoute(apiRouter);
new SecurityTokensRoute(apiRouter);
new NotificationsRoute(apiRouter);
new RedirectsRoute(apiRouter);
new FilesRoute(apiRouter);
new AppsRoute(apiRouter);
new WebhooksRoute(apiRouter);

module.exports = apiRouter;
