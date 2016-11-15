'use strict';

var ProductsService = require('../../services/products/products');

class ProductsController {
  constructor(router) {
        this.router = router;
        this.registerRoutes();
  }

  registerRoutes() {
       this.router.get('/products', this.getProducts.bind(this));
       this.router.get('/products/:id', this.getSingleProduct.bind(this));
       this.router.post('/products/', this.addProduct.bind(this));
       this.router.put('/products/:id', this.updateProduct.bind(this));
       this.router.delete('/products/:id', this.deleteProduct.bind(this));
       this.router.post('/products/:id/images', this.addProductImage.bind(this));
       this.router.delete('/products/:id/images/:image', this.deleteProductImage.bind(this));
   }

   getProducts(req, res) {
     ProductsService.getProducts(req.query)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getSingleProduct(req, res) {
     ProductsService.getSingleProduct(req.params.id, req.query.currency)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   addProduct(req, res) {
     ProductsService.addProduct(req.body)
      .then(data => { res.send(data) })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }


   updateProduct(req, res) {
     ProductsService.updateProduct(req.params.id, req.body)
      .then(data => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   deleteProduct(req, res) {
     ProductsService.deleteProduct(req.params.id)
      .then(data => { res.end() })
      .catch(err => { res.status(500).send(this.getErrorMessage(err)) });
   }

   addProductImage(req, res) {
     ProductsService.addProductImage(req, res);
   }

   deleteProductImage(req, res) {
     ProductsService.deleteProductImage(req.params.id, req.params.image)
     .then(data => { res.end() });
   }

   getErrorMessage(err) {
     return { 'error': true, 'message': err.toString() };
   }
}

module.exports = ProductsController;
