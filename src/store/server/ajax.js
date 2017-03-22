import express from 'express'
let ajaxRouter = express.Router();
import serverSettings from './settings'
import api from 'cezerin-client';
api.init(serverSettings.apiBaseUrl, serverSettings.security.token);

const DEFAULT_CACHE_CONTROL = 'public, max-age=600';
const PRODUCTS_CACHE_CONTROL = 'public, max-age=60';

const fillCartItemWithProductData = (products, cartItem) => {
  const product = products.find(p => p.id === cartItem.product_id);
  if(product) {
    cartItem.image_url = product.images.length > 0 ? product.images[0].url : null;
    cartItem.stock_quantity = product.stock_quantity;
  }
  return cartItem;
}

const addProductsDataToCartItems = (cart) => {
  const productIds = cart.items.map(item => item.product_id);
  return api.products.list({ ids: productIds, fields: 'images,enabled,stock_quantity' }).then(({status, json}) => {
    const newCartItem = cart.items.map(cartItem => fillCartItemWithProductData(json, cartItem))
    cart.items = newCartItem;
    return cart;
  })
}

ajaxRouter.get('/products', (req, res, next) => {
  const filter = req.query;
  filter.enabled = true;
  api.products.list(filter).then(({status, json}) => {
    res.status(status).header('Cache-Control', PRODUCTS_CACHE_CONTROL).send(json);
  })
})

ajaxRouter.get('/products/:id', (req, res, next) => {
  api.products.retrieve(req.params.id).then(({status, json}) => {
    res.status(status).send(json);
  })
})

ajaxRouter.get('/cart', (req, res, next) => {
  const order_id = req.signedCookies.order_id;
  if (order_id) {
    api.orders.retrieve(order_id).then(({status, json}) => {
      if(json && json.items && json.items.length > 0) {
        return addProductsDataToCartItems(json).then(cart => {
          res.status(status).send(cart);
        })
      } else {
        res.status(status).send(json);
      }
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
      res.status(status).send(json);
    })
  } else {

    let ip = req.get('x-forwarded-for') || req.ip;

    if(ip && ip.includes(', ')) {
      ip = ip.split(', ')[0];
    }

    if(ip && ip.includes('::ffff:')) {
      ip = ip.replace('::ffff:', '');
    }

    api.orders.create({
      draft: true,
      referrer_url: req.signedCookies.referrer_url,
      landing_url: req.signedCookies.landing_url,
      browser: {
        ip: ip,
        user_agent: req.get('user-agent')
      }
    }).then(({status, json}) => {
      res.cookie('order_id', json.id, serverSettings.cartCookieOptions);
      api.orders.addItem(json.id, item).then(({status, json}) => {
        res.status(status).send(json);
      })
    })
  }
})

ajaxRouter.delete('/cart/items/:item_id', (req, res, next) => {
  const order_id = req.signedCookies.order_id;
  const item_id = req.params.item_id;
  if (order_id && item_id) {
    api.orders.deleteItem(order_id, item_id).then(({status, json}) => {
      res.status(status).send(json);
    })
  } else {
    res.end();
  }
})

ajaxRouter.put('/cart/items/:item_id', (req, res, next) => {
  const order_id = req.signedCookies.order_id;
  const item_id = req.params.item_id;
  const item = req.body;
  if (order_id && item_id) {
    api.orders.updateItem(order_id, item_id, item).then(({status, json}) => {
      res.status(status).send(json);
    })
  } else {
    res.end();
  }
})

ajaxRouter.put('/cart/checkout', (req, res, next) => {
  const order_id = req.signedCookies.order_id;
  if (order_id) {
    api.orders.checkout(order_id).then(({status, json}) => {
      res.clearCookie('order_id');
      res.status(status).send(json);
    })
  } else {
    res.end();
  }
});

ajaxRouter.put('/cart', (req, res, next) => {
  const order_id = req.signedCookies.order_id;
  if (order_id) {
    api.orders.update(order_id, req.body).then(({status, json}) => {
      res.status(status).send(json);
    })
  } else {
    res.end();
  }
})

ajaxRouter.put('/cart/shipping_address', (req, res, next) => {
  const order_id = req.signedCookies.order_id;
  if (order_id) {
    api.orders.updateShippingAddress(order_id, req.body).then(({status, json}) => {
      res.status(status).send(json);
    })
  } else {
    res.end();
  }
})

ajaxRouter.put('/cart/billing_address', (req, res, next) => {
  const order_id = req.signedCookies.order_id;
  if (order_id) {
    api.orders.updateBillingAddress(order_id, req.body).then(({status, json}) => {
      res.status(status).send(json);
    })
  } else {
    res.end();
  }
})

ajaxRouter.get('/product_categories', (req, res, next) => {
  api.product_categories.list(req.query).then(({status, json}) => {
    res.status(status).header('Cache-Control', DEFAULT_CACHE_CONTROL).send(json);
  })
})

ajaxRouter.get('/product_categories/:id', (req, res, next) => {
  api.product_categories.retrieve(req.params.id).then(({status, json}) => {
    res.status(status).header('Cache-Control', DEFAULT_CACHE_CONTROL).send(json);
  })
})

ajaxRouter.get('/pages/:id', (req, res, next) => {
  api.pages.retrieve(req.params.id).then(({status, json}) => {
    res.status(status).header('Cache-Control', DEFAULT_CACHE_CONTROL).send(json);
  })
})

ajaxRouter.get('/sitemap', (req, res, next) => {
  const filter = req.query;
  filter.enabled = true;
  api.sitemap.retrieve(req.query).then(({status, json}) => {
    res.status(status).header('Cache-Control', DEFAULT_CACHE_CONTROL).send(json);
  })
})

ajaxRouter.get('/payment_methods', (req, res, next) => {
  const filter = {
    order_id: req.signedCookies.order_id
  };
  api.payment_methods.list(filter).then(({status, json}) => {
    res.status(status).send(json);
  })
})

ajaxRouter.get('/shipping_methods', (req, res, next) => {
  const filter = {
    order_id: req.signedCookies.order_id
  };
  api.shipping_methods.list(filter).then(({status, json}) => {
    res.status(status).send(json);
  })
})

ajaxRouter.get('/countries', (req, res, next) => {
  api.countries.list().then(({status, json}) => {
    res.status(status).header('Cache-Control', DEFAULT_CACHE_CONTROL).send(json);
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
