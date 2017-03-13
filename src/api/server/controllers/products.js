'use strict';

var ProductsService = require('../services/products/products');

class ProductsController {
  constructor(router) {
        this.router = router;
        this.registerRoutes();
  }

  registerRoutes() {
       this.router.get('/products', this.getProducts.bind(this));
       this.router.post('/products', this.addProduct.bind(this));
       this.router.get('/products/:id', this.getSingleProduct.bind(this));
       this.router.put('/products/:id', this.updateProduct.bind(this));
       this.router.delete('/products/:id', this.deleteProduct.bind(this));
       this.router.post('/products/:id/images', this.addProductImage.bind(this));
       this.router.delete('/products/:id/images/:image', this.deleteProductImage.bind(this));
       this.router.get('/products/:id/sku', this.isSkuExists.bind(this));
       this.router.get('/products/:id/slug', this.isSlugExists.bind(this));
   }

   getProducts(req, res, next) {
     ProductsService.getProducts(req.query)
      .then(data => { res.send(data) })
      .catch(next);
   }

   getSingleProduct(req, res, next) {
     ProductsService.getSingleProduct(req.params.id)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch(next);
   }

   addProduct(req, res, next) {
     ProductsService.addProduct(req.body)
      .then(data => { res.send(data) })
      .catch(next);
   }


   updateProduct(req, res, next) {
     ProductsService.updateProduct(req.params.id, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(next);
   }

   deleteProduct(req, res, next) {
     ProductsService.deleteProduct(req.params.id)
      .then(data => { res.status(data ? 200 : 404).end() })
      .catch(next);
   }

   addProductImage(req, res, next) {
     ProductsService.addProductImage(req, res, next);
   }

   deleteProductImage(req, res, next) {
     ProductsService.deleteProductImage(req.params.id, req.params.image)
     .then(data => { res.end() });
   }

   isSkuExists(req, res, next) {
     ProductsService.isSkuExists(req.query.sku, req.params.id)
      .then(exists => { res.status(exists ? 200 : 404).end() })
      .catch(next);
   }

   isSlugExists(req, res, next) {
     ProductsService.isSlugExists(req.query.slug, req.params.id)
      .then(exists => { res.status(exists ? 200 : 404).end() })
      .catch(next);
   }
}

module.exports = ProductsController;
