'use strict';

const security = require('../lib/security');
var ProductsService = require('../services/products/products');
var ProductOptionsService = require('../services/products/options');
var ProductOptionValuesService = require('../services/products/optionValues');
var ProductVariantsService = require('../services/products/variants');

class ProductsController {
  constructor(router) {
    this.router = router;
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get('/v1/products', security.checkUserScope.bind(this, security.scope.READ_PRODUCTS), this.getProducts.bind(this));
    this.router.post('/v1/products', security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS), this.addProduct.bind(this));
    this.router.get('/v1/products/:productId', security.checkUserScope.bind(this, security.scope.READ_PRODUCTS), this.getSingleProduct.bind(this));
    this.router.put('/v1/products/:productId', security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS), this.updateProduct.bind(this));
    this.router.delete('/v1/products/:productId', security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS), this.deleteProduct.bind(this));

    this.router.get('/v1/products/:productId/images', security.checkUserScope.bind(this, security.scope.READ_PRODUCTS), this.getProductImages.bind(this));
    this.router.post('/v1/products/:productId/images', security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS), this.addProductImage.bind(this));
    this.router.delete('/v1/products/:productId/images/:image', security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS), this.deleteProductImage.bind(this));

    this.router.get('/v1/products/:productId/sku', security.checkUserScope.bind(this, security.scope.READ_PRODUCTS), this.isSkuExists.bind(this));
    this.router.get('/v1/products/:productId/slug', security.checkUserScope.bind(this, security.scope.READ_PRODUCTS), this.isSlugExists.bind(this));

    this.router.get('/v1/products/:productId/options', security.checkUserScope.bind(this, security.scope.READ_PRODUCTS), this.getOptions.bind(this));
    this.router.get('/v1/products/:productId/options/:optionId', security.checkUserScope.bind(this, security.scope.READ_PRODUCTS), this.getSingleOption.bind(this));
    this.router.post('/v1/products/:productId/options', security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS), this.addOption.bind(this));
    this.router.put('/v1/products/:productId/options/:optionId', security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS), this.updateOption.bind(this));
    this.router.delete('/v1/products/:productId/options/:optionId', security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS), this.deleteOption.bind(this));

    this.router.get('/v1/products/:productId/options/:optionId/values', security.checkUserScope.bind(this, security.scope.READ_PRODUCTS), this.getOptionValues.bind(this));
    this.router.get('/v1/products/:productId/options/:optionId/values/:valueId', security.checkUserScope.bind(this, security.scope.READ_PRODUCTS), this.getSingleOptionValue.bind(this));
    this.router.post('/v1/products/:productId/options/:optionId/values', security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS), this.addOptionValue.bind(this));
    this.router.put('/v1/products/:productId/options/:optionId/values/:valueId', security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS), this.updateOptionValue.bind(this));
    this.router.delete('/v1/products/:productId/options/:optionId/values/:valueId', security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS), this.deleteOptionValue.bind(this));

    this.router.get('/v1/products/:productId/variants', security.checkUserScope.bind(this, security.scope.READ_PRODUCTS), this.getVariants.bind(this));
    this.router.post('/v1/products/:productId/variants', security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS), this.addVariant.bind(this));
    this.router.put('/v1/products/:productId/variants/:variantId', security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS), this.updateVariant.bind(this));
    this.router.delete('/v1/products/:productId/variants/:variantId', security.checkUserScope.bind(this, security.scope.WRITE_PRODUCTS), this.deleteVariant.bind(this));
  }

  getProducts(req, res, next) {
    ProductsService.getProducts(req.query).then(data => {
      res.send(data)
    }).catch(next);
  }

  getSingleProduct(req, res, next) {
    ProductsService.getSingleProduct(req.params.productId).then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).end()
      }
    }).catch(next);
  }

  addProduct(req, res, next) {
    ProductsService.addProduct(req.body).then(data => {
      res.send(data)
    }).catch(next);
  }

  updateProduct(req, res, next) {
    ProductsService.updateProduct(req.params.productId, req.body).then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).end()
      }
    }).catch(next);
  }

  deleteProduct(req, res, next) {
    ProductsService.deleteProduct(req.params.productId).then(data => {
      res.status(data
        ? 200
        : 404).end()
    }).catch(next);
  }

  getProductImages(req, res, next) {
    ProductsService.getProductImages(req.params.productId).then(data => {
      res.send(data)
    }).catch(next);
  }

  addProductImage(req, res, next) {
    ProductsService.addProductImage(req, res, next);
  }

  deleteProductImage(req, res, next) {
    ProductsService.deleteProductImage(req.params.productId, req.params.image).then(data => {
      res.end()
    });
  }

  isSkuExists(req, res, next) {
    ProductsService.isSkuExists(req.query.sku, req.params.productId).then(exists => {
      res.status(exists
        ? 200
        : 404).end()
    }).catch(next);
  }

  isSlugExists(req, res, next) {
    ProductsService.isSlugExists(req.query.slug, req.params.productId).then(exists => {
      res.status(exists
        ? 200
        : 404).end()
    }).catch(next);
  }

  getOptions(req, res, next) {
    ProductOptionsService.getOptions(req.params.productId).then(data => {
      res.send(data)
    }).catch(next);
  }

  getSingleOption(req, res, next) {
    ProductOptionsService.getSingleOption(req.params.productId, req.params.optionId).then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).end()
      }
    }).catch(next);
  }

  addOption(req, res, next) {
    ProductOptionsService.addOption(req.params.productId, req.body).then(data => {
      res.send(data)
    }).catch(next);
  }

  updateOption(req, res, next) {
    ProductOptionsService.updateOption(req.params.productId, req.params.optionId, req.body).then(data => {
      res.send(data)
    }).catch(next);
  }

  deleteOption(req, res, next) {
    ProductOptionsService.deleteOption(req.params.productId, req.params.optionId).then(data => {
      res.send(data)
    }).catch(next);
  }

  getOptionValues(req, res, next) {
    ProductOptionValuesService.getOptionValues(req.params.productId, req.params.optionId).then(data => {
      res.send(data)
    }).catch(next);
  }

  getSingleOptionValue(req, res, next) {
    ProductOptionValuesService.getSingleOptionValue(req.params.productId, req.params.optionId, req.params.valueId).then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).end()
      }
    }).catch(next);
  }

  addOptionValue(req, res, next) {
    ProductOptionValuesService.addOptionValue(req.params.productId, req.params.optionId, req.body).then(data => {
      res.send(data)
    }).catch(next);
  }

  updateOptionValue(req, res, next) {
    ProductOptionValuesService.updateOptionValue(req.params.productId, req.params.optionId, req.params.valueId, req.body).then(data => {
      res.send(data)
    }).catch(next);
  }

  deleteOptionValue(req, res, next) {
    ProductOptionValuesService.deleteOptionValue(req.params.productId, req.params.optionId, req.params.valueId).then(data => {
      res.send(data)
    }).catch(next);
  }

  getVariants(req, res, next) {
    ProductVariantsService.getVariants(req.params.productId).then(data => {
      res.send(data)
    }).catch(next);
  }

  addVariant(req, res, next) {
    ProductVariantsService.addVariant(req.params.productId, req.body).then(data => {
      res.send(data)
    }).catch(next);
  }

  updateVariant(req, res, next) {
    ProductVariantsService.updateVariant(req.params.productId, req.params.variantId, req.body).then(data => {
      res.send(data)
    }).catch(next);
  }

  deleteVariant(req, res, next) {
    ProductVariantsService.deleteVariant(req.params.productId, req.params.variantId).then(data => {
      res.send(data)
    }).catch(next);
  }

}

module.exports = ProductsController;
