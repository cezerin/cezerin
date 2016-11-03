'use strict';

var CategoriesService = require('../../services/products/categories');

class CategoriesController {
  constructor(router) {
        this.router = router;
        this.registerRoutes();
  }

  registerRoutes() {
       this.router.get('/products/categories', this.getCategories.bind(this));
       this.router.get('/products/categories/:id', this.getSingleCategory.bind(this));
       this.router.post('/products/categories/', this.addCategory.bind(this));
       this.router.put('/products/categories/:id', this.updateCategory.bind(this));
       this.router.delete('/products/categories/:id', this.deleteCategory.bind(this));
       this.router.post('/products/categories/:id/image', this.uploadCategoryImage.bind(this));
       this.router.delete('/products/categories/:id/image', this.deleteCategoryImage.bind(this));
   }

   getCategories(req, res) {
     CategoriesService.getCategories(req.app.locals.language)
      .then((data) => { res.send(data) })
      .catch((err) => { res.status(500).send(err) });
   }

   getSingleCategory(req, res) {
     CategoriesService.getSingleCategory(req.app.locals.language, req.params.id)
      .then((data) => {
        if(data) {
          //setTimeout(()=>{ res.send(data) }, 3000);
          res.send(data)
        } else {
          res.status(404).end()
        }
      })
      .catch((err) => { res.status(500).send(err) });
   }

   addCategory(req, res) {
     CategoriesService.addCategory(req.app.locals.language, req.body)
      .then((data) => { res.send(data) })
      .catch((err) => { res.status(500).send(err) });
   }


   updateCategory(req, res) {
     CategoriesService.updateCategory(req.app.locals.language, req.params.id, req.body)
      .then((data) => {
        if(data) {
          res.send(data)
        } else {
          res.status(404).end()
        }
       })
      .catch((err) => { res.status(500).send(err) });
   }

   deleteCategory(req, res) {
     CategoriesService.deleteCategory(req.params.id)
      .then((data) => { res.end() })
      .catch((err) => { res.status(500).send(err) });
   }

   uploadCategoryImage(req, res) {
     CategoriesService.uploadCategoryImage(req, res);
   }

   deleteCategoryImage(req, res) {
     CategoriesService.deleteCategoryImage(req.params.id);
     res.end();
   }
}

module.exports = CategoriesController;
