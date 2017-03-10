'use strict';

var CategoriesService = require('../services/products/product_categories');

class ProductCategoriesController {
  constructor(router) {
        this.router = router;
        this.registerRoutes();
  }

  registerRoutes() {
       this.router.get('/product_categories', this.getCategories.bind(this));
       this.router.post('/product_categories', this.addCategory.bind(this));
       this.router.get('/product_categories/:id', this.getSingleCategory.bind(this));
       this.router.put('/product_categories/:id', this.updateCategory.bind(this));
       this.router.delete('/product_categories/:id', this.deleteCategory.bind(this));
       this.router.post('/product_categories/:id/image', this.uploadCategoryImage.bind(this));
       this.router.delete('/product_categories/:id/image', this.deleteCategoryImage.bind(this));
   }

   getCategories(req, res, next) {
     CategoriesService.getCategories(req.query)
      .then((data) => { res.send(data) })
      .catch(next);
   }

   getSingleCategory(req, res, next) {
     CategoriesService.getSingleCategory(req.params.id)
      .then((data) => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch(next);
   }

   addCategory(req, res, next) {
     CategoriesService.addCategory(req.body)
      .then((data) => { res.send(data) })
      .catch(next);
   }


   updateCategory(req, res, next) {
     CategoriesService.updateCategory(req.params.id, req.body)
      .then((data) => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch(next);
   }

   deleteCategory(req, res, next) {
     CategoriesService.deleteCategory(req.params.id)
      .then(data => { res.status(data ? 200 : 404).end() })
      .catch(next);
   }

   uploadCategoryImage(req, res, next) {
     CategoriesService.uploadCategoryImage(req, res, next);
   }

   deleteCategoryImage(req, res, next) {
     CategoriesService.deleteCategoryImage(req.params.id);
     res.end();
   }
}

module.exports = ProductCategoriesController;
