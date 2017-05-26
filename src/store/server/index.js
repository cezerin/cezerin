import express from 'express'
let storeRouter = express.Router();
import serverSettings from './settings'

import jwt from 'jsonwebtoken'
const TOKEN_PAYLOAD = {email: 'store', scopes: ['admin']};
const STORE_ACCESS_TOKEN = jwt.sign(TOKEN_PAYLOAD, serverSettings.jwtSecretKey);

import api from 'cezerin-client';
api.initAjax(serverSettings.ajaxBaseUrl);
api.init(serverSettings.apiBaseUrl, STORE_ACCESS_TOKEN);

import robotsRendering from './robotsRendering'
import sitemapRendering from './sitemapRendering'
import pageRendering from './pageRendering'

storeRouter.get('/robots.txt', robotsRendering)
storeRouter.get('/sitemap.xml', sitemapRendering);
storeRouter.get('*', pageRendering);

module.exports = storeRouter;
