'use strict';

var CategoriesService = require('../../services/products/product_categories');

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

   getCategories(req, res) {
     CategoriesService.getCategories()
      .then((data) => { res.send(data) })
      .catch((err) => { res.status(500).send(this.getErrorMessage(err)) });
   }

   getSingleCategory(req, res) {
     CategoriesService.getSingleCategory(req.params.id)
      .then((data) => {
        if(data) {
          //setTimeout(()=>{ res.send(data) }, 3000);
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch((err) => { res.status(500).send(this.getErrorMessage(err)) });
   }

   addCategory(req, res) {
     CategoriesService.addCategory(req.body)
      .then((data) => { res.send(data) })
      .catch((err) => { res.status(500).send(this.getErrorMessage(err)) });
   }


   updateCategory(req, res) {
     CategoriesService.updateCategory(req.params.id, req.body)
      .then((data) => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch((err) => { res.status(500).send(this.getErrorMessage(err)) });
   }

   deleteCategory(req, res) {
     CategoriesService.deleteCategory(req.params.id)
      .then((data) => { res.end() })
      .catch((err) => { res.status(500).send(this.getErrorMessage(err)) });
   }

   uploadCategoryImage(req, res) {
     CategoriesService.uploadCategoryImage(req, res);
   }

   deleteCategoryImage(req, res) {
     CategoriesService.deleteCategoryImage(req.params.id);
     res.end();
   }

   getErrorMessage(err) {
     return { 'error': true, 'message': err.toString() };
   }
}

module.exports = ProductCategoriesController;
