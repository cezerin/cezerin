const express = require('express');
const app = express();
const helmet = require('helmet');
const responseTime = require('response-time');
const path = require('path');
const cookieParser = require('cookie-parser');
const winston = require('winston');
const settings = require('../../../config/server');
const logger = require('./logger').default;
const robotsRendering = require('./robotsRendering').default;
const sitemapRendering = require('./sitemapRendering').default;
const redirects = require('./redirects').default;
const pageRendering = require('./pageRendering').default;

const ADMIN_INDEX_PATH = path.resolve('public/admin/index.html');
const STATIC_OPTIONS = {
  maxAge: 31536000000 // One year
};

app.set('trust proxy', 1);
app.use(helmet());
app.get('/images/:entity/:id/:size/:filename', (req, res, next) => {
  // A stub of image resizing (can be done with Nginx)
  const newUrl = `/images/${req.params.entity}/${req.params.id}/${req.params.filename}`;
  req.url = newUrl;
  next();
});
app.use(express.static('public/content', STATIC_OPTIONS));
app.use('/assets', express.static('theme/assets', STATIC_OPTIONS));
app.use('/admin-assets', express.static('public/admin-assets', STATIC_OPTIONS));
app.use('/sw.js', express.static('public/sw.js', STATIC_OPTIONS));
app.use('/sw-toolbox.js', express.static('public/sw-toolbox.js', STATIC_OPTIONS));
app.use('/admin', (req, res) => {
  res.sendFile(ADMIN_INDEX_PATH)
});
app.get(/^.+\.(jpg|jpeg|gif|png|bmp|ico|webp|svg|css|js|zip|rar|flv|swf|xls)$/, (req, res) => {
  res.status(404).end();
});
app.get('/robots.txt', robotsRendering)
app.get('/sitemap.xml', sitemapRendering);
app.get('*', redirects);
app.use(responseTime());
app.use(cookieParser(settings.cookieSecretKey));
app.get('*', pageRendering);

const server = app.listen(settings.storeListenPort, () => {
  const serverAddress = server.address();
  winston.info(`Store running at http://localhost:${serverAddress.port}`);
});
