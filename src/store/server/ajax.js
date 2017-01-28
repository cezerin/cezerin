import express from 'express'
let ajaxRouter = express.Router();
import serverSettings from './settings'
import api from 'cezerin-client';
api.init(serverSettings.api.baseUrl, serverSettings.api.token);

const cartCookieOptions = {
  maxAge: serverSettings.cart_cookie_max_age,
  secure: serverSettings.cart_cookie_secure,
  httpOnly: true,
  signed: true,
  sameSite: 'strict'
}

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

ajaxRouter.get('/cart', (req, res, next) => {
  const order_id = req.signedCookies.order_id;
  if (order_id) {
    api.orders.retrieve(order_id).then(({status, json}) => {
      res.send(json);
    })
  } else {
    res.end();
  }
})

ajaxRouter.post('/cart/items', (req, res, next) => {
  const order_id = req.signedCookies.order_id;
  const item = req.body;
  if (order_id) {
    api.orders.addItem(order_id, item).then(({status, json}) => {
      res.send(json);
    })
  } else {
    api.orders.create({}).then(({status, json}) => {
      res.cookie('order_id', json.id, cartCookieOptions);
      api.orders.addItem(json.id, item).then(({status, json}) => {
        res.send(json);
      })
    })
  }
})

ajaxRouter.delete('/cart/items/:item_id', (req, res, next) => {
  const order_id = req.signedCookies.order_id;
  const item_id = req.params.item_id;
  if (order_id && item_id) {
    api.orders.deleteItem(order_id, item_id).then(({status, json}) => {
      res.send(json);
    })
  } else {
    res.end();
  }
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
  res.status(405).send({'error': 'Method Not Allowed'});
})

ajaxRouter.use(function(err, req, res, next) {
  if (err) {
    res.status(500).send({'error': err});
  }
});

module.exports = ajaxRouter;
