import express from 'express'
let storeRouter = express.Router();

import robotsRendering from './robotsRendering'
import sitemapRendering from './sitemapRendering'
import pageRendering from './pageRendering'
import redirects from './redirects'

storeRouter.get('/robots.txt', robotsRendering)
storeRouter.get('/sitemap.xml', sitemapRendering);
storeRouter.get('*', redirects);
storeRouter.get('*', pageRendering);

module.exports = storeRouter;
