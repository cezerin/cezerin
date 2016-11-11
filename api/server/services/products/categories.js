'use strict';

const path = require('path');
const settings = require('../../lib/settings');
var mongo = require('../../lib/mongo');
var utils = require('../../lib/utils');
var parse = require('../../lib/parse');
var ObjectID = require('mongodb').ObjectID;
var formidable = require('formidable');
var fs = require('fs-extra');
var _ = require('lodash');

class CategoriesService {
  constructor() {}

  getCategories() {
    return new Promise((resolve, reject) => {
      mongo.db.collection('productCategories')
        .find()
        .toArray()
        .then((items) => {
          let renamedItems = items.map(c => this.renameDocumentFields(c));
          resolve(renamedItems);
        })
        .catch((err) => { reject(this.getErrorMessage(err)) });
      });

  }

  getSingleCategory(id) {
    return new Promise((resolve, reject) => {
      let categoryObjectID = this.parseObjectID(id);
      mongo.db.collection('productCategories')
        .findOne({ _id: categoryObjectID })
        .then((item) => {
          item = this.renameDocumentFields(item);
          resolve(item);
        })
        .catch((err) => { reject(this.getErrorMessage(err)) });
      });
  }

  addCategory(data) {
    return new Promise((resolve, reject) => {
      mongo.db.collection('productCategories').find().sort({position:-1}).limit(1)
      .nextObject()
      .then(item => {
        let newPosition = 0;
        if(item && item.position > 0) {
          newPosition = item.position;
        }
        newPosition++;

        this.getDocumentForInsert(data, newPosition)
        .then((dataToInsert) => {
          mongo.db.collection('productCategories')
            .insertMany([dataToInsert])
            .then((res) => {
              let insertedItem = res.ops[0];
              insertedItem = this.renameDocumentFields(insertedItem);
              resolve(insertedItem);
            })
            .catch((err) => { reject(this.getErrorMessage(err)) });
        });


      });
    });
  }

  updateCategory(id, data) {
    return new Promise((resolve, reject) => {
      let categoryObjectID = this.parseObjectID(id);
      this.getDocumentForUpdate(id, data)
      .then((dataToSet) => {
        mongo.db.collection('productCategories')
          .findOneAndUpdate({ _id: categoryObjectID }, {$set: dataToSet}, { returnOriginal: false })
          .then((res) => {
            if(res.value) {
              let updatedItem = res.value;
              updatedItem = this.renameDocumentFields(updatedItem);
              resolve(updatedItem);
            } else {
              resolve();
            }
           })
      })
      .catch((err) => { reject(this.getErrorMessage(err)) });;
    });
  }

  findAllChildren(items, id, result) {
    if(id && ObjectID.isValid(id)) {
      result.push(id.toString());
      let finded = items.filter(item => (item.parent_id === id));
      if(finded.length > 0) {
        for(let item of finded) {
          this.findAllChildren(items, item.id, result);
        }
      }
    }

    return result;
  }

  deleteCategory(id) {
    return new Promise((resolve, reject) => {
      // 1. get all categories
      this.getCategories()
      .then((items) => {

        // 2. find category and children
        var idsToDelete = [];
        this.findAllChildren(items, id, idsToDelete);

        // 3. delete categories
        let objectsToDelete = idsToDelete.map((id) => ( new ObjectID(id) ));
        mongo.db.collection('productCategories')
          .deleteMany({'_id':{'$in':objectsToDelete}})
          .then((res) => {
            // 4. delete directories with images
            for(let categoryId of idsToDelete) {
              let deleteDir = settings.path.uploads.categories + '/' + categoryId;
              fs.remove(deleteDir, err => {});
            }
            resolve();
          });
      });
    });
  }

  parseObjectID(id) {
    try {
      return new ObjectID(id);
    } catch (e) {
      throw this.getErrorMessage('Invalid identifier')
      return;
    }
  }

  getErrorMessage(err) {
    return { 'error': true, 'message': err.toString() };
  }

  getDocumentForInsert(data, newPosition) {
      //  Allow empty category to create draft

      let category = {
        'date_created': new Date(),
        'date_updated': null,
        'image': ''
      };

      category.name = parse.getString(data.name) || '';
      category.description = parse.getString(data.description) || '';
      category.meta_description = parse.getString(data.meta_description) || '';
      category.meta_title = parse.getString(data.meta_title) || '';
      category.active = parse.getBooleanIfValid(data.active, true);
      category.sort = parse.getString(data.sort);
      category.parent_id = parse.getObjectIDIfValid(data.parent_id);
      category.position = parse.getNumberIfValid(data.position) || newPosition;

      let slug = (!data.slug || data.slug.length === 0) ? data.name : data.slug;
      if(!slug || slug.length === 0) {
        return Promise.resolve(category);
      } else {
        return utils.getAvailableSlug(slug).then(newSlug => {
          category.slug = newSlug;
          return category;
        });
      }
  }

  getDocumentForUpdate(id, data) {
    return new Promise((resolve, reject) => {
      if(_.isEmpty(data)) {
        reject('Required fields are missing');
      }

      let category = {
        'date_updated': new Date()
      };

      if(!_.isUndefined(data.name)) {
        category.name = data.name;
      }

      if(!_.isUndefined(data.description)) {
        category.description = data.description;
      }

      if(!_.isUndefined(data.meta_description)) {
        category.meta_description = data.meta_description;
      }

      if(!_.isUndefined(data.meta_title)) {
        category.meta_title = data.meta_title;
      }

      if(!_.isUndefined(data.image)) {
        category.image = data.image;
      }

      if(!_.isUndefined(data.active)) {
        category.active = parse.getBooleanIfValid(data.active, true);
      }

      if(data.position >= 0) {
        category.position = data.position;
      }

      if(!_.isUndefined(data.sort)) {
        category.sort = data.sort;
      }

      if(!_.isUndefined(data.parent_id)) {
        category.parent_id = parse.getObjectIDIfValid(data.parent_id);
      }



      if(!_.isUndefined(data.slug)){
        let slug = data.slug;
        if(!slug || slug.length === 0) {
          slug = data.name;
        }

        utils.getAvailableSlug(slug, id)
        .then((newSlug) => {
          category.slug = newSlug;
          resolve(category);
        })
        .catch((err) => {
          reject(err);
        });

      } else {
        resolve(category);
      }
    });
  }

  renameDocumentFields(item) {
    if(item) {
      item.id = item._id.toString();
      delete item._id;

      if(item.parent_id) {
        item.parent_id = item.parent_id.toString();
      }

      item.url = path.join(settings.store.url.base, item.slug || '');

      if(!_.isEmpty(item.image)) {
        item.image = settings.url.uploads.categories + '/' + item.id + '/' + item.image;
      }

    }

    return item;
  }

  deleteCategoryImage(id) {
    let dir = settings.path.uploads.categories + '/' + id;
    fs.emptyDirSync(dir);
    this.updateCategory(id, { 'image': '' });
  }

  uploadCategoryImage(req, res) {
    let categoryId = req.params.id;
    let form = new formidable.IncomingForm(),
        file_name = null,
        file_size = 0;

    form
      .on('fileBegin', (name, file) => {
        // Emitted whenever a field / value pair has been received.
        let dir = settings.path.uploads.categories + '/' + categoryId;
        fs.emptyDirSync(dir);
        file.path = dir + '/' + file.name;
      })
      .on('file', function(field, file) {
        // every time a file has been uploaded successfully,
        file_name = file.name;
        file_size = file.size;
      })
      .on('error', (err) => {
        res.status(500).send(this.getErrorMessage(err));
      })
      .on('end', () => {
        //Emitted when the entire request has been received, and all contained files have finished flushing to disk.
        if(file_name) {
          this.updateCategory(categoryId, { 'image': file_name });
          res.send({ 'file': file_name, 'size': file_size });
        } else {
          res.status(400).send(this.getErrorMessage('Required fields are missing'));
        }
      });

    form.parse(req);
  }

}

module.exports = new CategoriesService();
