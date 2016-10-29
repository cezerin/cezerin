'use strict';

const settings = require('../../lib/settings');
var mongo = require('../../lib/mongo');
var utils = require('../../lib/utils');
var ObjectID = require('mongodb').ObjectID;
var formidable = require('formidable');
var fs = require('fs-extra')
var _ = require('lodash');

/* TODO
  validate add/update data types
  validate add/update data values
  implement Get with filters
*/
class CategoriesService {
  constructor() {}

  getCategories(language) {
    return new Promise((resolve, reject) => {
      mongo.db.collection('productCategories')
        .find()
        .toArray()
        .then((items) => {
          for(let key in items) {
            items[key] = this.renameDocumentFields(language, items[key]);
          }
          resolve(items);
        })
        .catch((err) => { reject(this.getErrorMessage(err)) });
      });

  }

  getSingleCategory(language, id) {
    return new Promise((resolve, reject) => {
      let categoryObjectID = this.parseObjectID(id);
      mongo.db.collection('productCategories')
        .findOne({ _id: categoryObjectID })
        .then((item) => {
          item = this.renameDocumentFields(language, item);
          resolve(item);
        })
        .catch((err) => { reject(this.getErrorMessage(err)) });
      });
  }

  addCategory(language, data) {
    return new Promise((resolve, reject) => {
      mongo.db.collection('productCategories').find().sort({position:-1}).limit(1)
      .nextObject()
      .then(item => {
        let newPosition = 0;
        if(item) {
          newPosition = item.position;
        }
        newPosition++;

        this.getDocumentForInsert(language, data, newPosition)
        .then((dataToInsert) => {
          mongo.db.collection('productCategories')
            .insertMany([dataToInsert])
            .then((res) => {
              let insertedItem = res.ops[0];
              insertedItem = this.renameDocumentFields(language, insertedItem);
              resolve(insertedItem);
            })
            .catch((err) => { reject(this.getErrorMessage(err)) });
        });


      });
    });
  }

  updateCategory(language, id, data) {
    return new Promise((resolve, reject) => {
      let categoryObjectID = this.parseObjectID(id);
      this.getDocumentForUpdate(id, language, data)
      .then((dataToSet) => {
        mongo.db.collection('productCategories')
          .findOneAndUpdate({ _id: categoryObjectID }, {$set: dataToSet}, { returnOriginal: false })
          .then((res) => {
            if(res.value) {
              let updatedItem = res.value;
              updatedItem = this.renameDocumentFields(language, updatedItem);
              resolve(updatedItem);
            } else {
              resolve();
            }
           })
          .catch((err) => { reject(this.getErrorMessage(err)) });
      });
    });
  }

  findAllChildren(items, id, result) {
    if(id && ObjectID.isValid(id)) {
      result.push(id);
      let finded = items.filter((item) => (item.parent_id === id));
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
      this.getCategories('en')
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

  getDocumentForInsert(language, data, newPosition) {
    return new Promise((resolve, reject) => {
      //  Allow empty category to create draft

      let category = {
        'parent_id': null,
        'date_created': new Date(),
        'name': {},
        'description': {},
        'meta_description': {},
        'meta_title': {},
        'image': '',
        'position': newPosition
      };

      let activeByDefault = true;

      category.name[language] = data.name || '';
      category.description[language] = data.description || '';
      category.meta_description[language] = data.meta_description || '';
      category.meta_title[language] = data.meta_title || '';
      category.active = _.isUndefined(data.active) || data.active === null ? activeByDefault : data.active;
      category.sort = data.sort || '';

      if(data.position >= 0) {
        category.position = data.position;
      }

      if(ObjectID.isValid(data.parent_id) || data.parent_id === null) {
        category.parent_id = this.parseObjectID(data.parent_id);
      }

      let slug = (!data.slug || data.slug.length === 0) ? data.name : data.slug;
      if(!slug || slug.length === 0) {
        resolve(category);
      } else {
        utils.getAvailableSlug(slug)
        .then((newSlug) => {
          category.slug = newSlug;
          resolve(category);
        })
        .catch((err) => {
          reject(err);
        });
      }

    })
  }

  getDocumentForUpdate(id, language, data) {
    return new Promise((resolve, reject) => {
      if(_.isEmpty(data)) {
        reject('Required fields are missing');
      }

      let category = {
        'date_updated': new Date()
      };

      if(language) {
        if(!_.isUndefined(data.name)) {
          category['name.' + language] = data.name;
        }

        if(!_.isUndefined(data.description)) {
          category['description.' + language] = data.description;
        }

        if(!_.isUndefined(data.meta_description)) {
          category['meta_description.' + language] = data.meta_description;
        }

        if(!_.isUndefined(data.meta_title)) {
          category['meta_title.' + language] = data.meta_title;
        }
      }

      if(!_.isUndefined(data.image)) {
        category.image = data.image;
      }

      if(!_.isUndefined(data.active)) {
        category.active = data.active;
      }

      if(data.position >= 0) {
        category.position = data.position;
      }

      if(!_.isUndefined(data.sort)) {
        category.sort = data.sort;
      }

      if(!_.isUndefined(data.parent_id) && (data.parent_id === null || data.parent_id === '')) {
        category.parent_id = null;
      } else if (ObjectID.isValid(data.parent_id)) {
        category.parent_id = this.parseObjectID(data.parent_id);
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

  renameDocumentFields(language, item) {
    if(item) {
      item.id = item._id.toString();
      delete item._id;

      if(item.parent_id) {
        item.parent_id = item.parent_id.toString();
      }

      if(item.name) {
        item.name = item.name[language];
      }

      if(item.description) {
        item.description = item.description[language];
      }

      if(item.meta_description) {
        item.meta_description = item.meta_description[language];
      }

      if(item.meta_title) {
        item.meta_title = item.meta_title[language];
      }

      if(!_.isEmpty(item.image)) {
        item.image = settings.url.uploads.categories + '/' + item.id + '/' + item.image;
      }

    }

    return item;
  }

  deleteCategoryImage(id, withUpdate) {
    let dir = settings.path.uploads.categories + '/' + id;
    fs.emptyDirSync(dir);
    if(withUpdate) {
      this.updateCategory(null, id, { 'image': '' });
    }
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
        console.log(`uploading to: ${file.path}`);
      })
      .on('file', function(field, file) {
        // every time a file has been uploaded successfully,
        file_name = file.name;
        file_size = file.size;
        console.log(`${file.name} uploaded`)
      })
      .on('error', (err) => {
        res.status(500).send(this.getErrorMessage(err));
      })
      .on('end', () => {
        //Emitted when the entire request has been received, and all contained files have finished flushing to disk.
        if(file_name) {
          this.updateCategory(null, categoryId, { 'image': file_name });
          res.send({ 'file': file_name, 'size': file_size });
        } else {
          res.status(400).send(this.getErrorMessage('Required fields are missing'));
        }
      });

    form.parse(req);
  }

}

module.exports = new CategoriesService();
