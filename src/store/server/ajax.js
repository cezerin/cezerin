import express from 'express'
let ajaxRouter = express.Router();
import serverSettings from './settings'
import api from 'cezerin-client';
api.init(serverSettings.api.baseUrl, serverSettings.api.token);


ajaxRouter.get('/products', (req, res, next) => {
  api.products.list(req.query).then(({status, json}) => {
    res.send(json);
  })
})

ajaxRouter.get('/products/:id', (req, res, next) => {
  api.products.retrieve(req.params.id).then(({status, json}) => {
    res.send(json);
  })
})

ajaxRouter.get('/product_categories', (req, res, next) => {
  api.product_categories.list().then(({status, json}) => {
    res.send(json);
  })
})

ajaxRouter.get('/product_categories/:id', (req, res, next) => {
  api.product_categories.retrieve(req.params.id).then(({status, json}) => {
    res.send(json);
  })
})

ajaxRouter.get('/sitemap', (req, res, next) => {
  api.sitemap.retrieve(req.query.path).then(({status, json}) => {
    res.send(json);
  })
})

ajaxRouter.all('*', (req, res, next) => {
  res.status(405).send({ 'error': 'Method Not Allowed' });
})

ajaxRouter.use(function(err, req, res, next) {
  if(err) {
    res.status(500).send({ 'error': err });
  }
});

module.exports = ajaxRouter;
