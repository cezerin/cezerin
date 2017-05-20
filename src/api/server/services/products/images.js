'use strict';

const path = require('path');
const url = require('url');
const settings = require('../../lib/settings');
var mongo = require('../../lib/mongo');
var utils = require('../../lib/utils');
var parse = require('../../lib/parse');
const SettingsService = require('../settings/settings');
var ObjectID = require('mongodb').ObjectID;
var formidable = require('formidable');
var fs = require('fs-extra');

class ProductImagesService {
  constructor() {}

  getErrorMessage(err) {
    return { 'error': true, 'message': err.toString() };
  }

  getImages(productId) {
    if(!ObjectID.isValid(productId)) {
      return Promise.reject('Invalid identifier');
    }
    let productObjectID = new ObjectID(productId);

    return SettingsService.getSettings().then(generalSettings =>
      mongo.db.collection('products').findOne({ _id: productObjectID }, {fields: {images: 1}}).then(product => {
        if(product && product.images && product.images.length > 0) {
          let images = product.images.map(image => {
            image.url = url.resolve(generalSettings.domain, settings.productsUploadUrl + '/' + product._id + '/' + image.filename);
            return image;
          })

          images = images.sort((a,b) => (a.position - b.position ));
          return images;
        } else {
          return []
        }
      })
    )
  }

  deleteImage(productId, imageId) {
    if(!ObjectID.isValid(productId) || !ObjectID.isValid(imageId)) {
      return Promise.reject('Invalid identifier');
    }
    let productObjectID = new ObjectID(productId);
    let imageObjectID = new ObjectID(imageId);

    return this.getImages(productId)
    .then(images => {
      if(images && images.length > 0) {
        let imageData = images.find(i => i.id.toString() === imageId.toString());
        if(imageData) {
          let filename = imageData.filename;
          let filepath = path.resolve(settings.productsUploadPath + '/' + productId + '/' + filename);
          fs.removeSync(filepath);
          return mongo.db.collection('products').updateOne({ _id: productObjectID }, { $pull: { images: { id: imageId } } })
        } else {
          return true;
        }
      } else {
        return true;
      }
    })
    .then(() => true);
  }

  addImage(req, res) {
    let productId = req.params.productId;
    if(!ObjectID.isValid(productId)) {
      return Promise.reject('Invalid identifier');
    }
    let productObjectID = new ObjectID(productId);
    let uploadedFiles = [];
    let uploadDir = path.resolve(settings.productsUploadPath + '/' + productId);
    fs.ensureDirSync(uploadDir);

    let form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;

    form
      .on('fileBegin', (name, file) => {
        // Emitted whenever a field / value pair has been received.
        file.path = uploadDir + '/' + file.name;
      })
      .on('file', function(field, file) {
        // every time a file has been uploaded successfully,
        if(file.name) {
          var imageData = {
            "id": new ObjectID(),
            "alt": "",
            "position": 99,
            "filename": file.name
          };

          mongo.db.collection('products')
            .updateOne({ _id: productObjectID }, { $push: { images: imageData } })
            .then();
          uploadedFiles.push({ 'file': file.name, 'size': file.size });
        }
      })
      .on('error', (err) => {
        res.status(500).send(this.getErrorMessage(err));
      })
      .on('end', () => {
        res.send(uploadedFiles);
      });

    form.parse(req);
  }

  updateImage(productId, imageId, data) {
    if(!ObjectID.isValid(productId) || !ObjectID.isValid(imageId)) {
      return Promise.reject('Invalid identifier');
    }
    let productObjectID = new ObjectID(productId);
    let imageObjectID = new ObjectID(imageId);

    const imageData = this.getValidDocumentForUpdate(data);

    return mongo.db.collection('products').updateOne({
      _id: productObjectID,
      'images.id': imageObjectID
    }, {$set: imageData});
  }

  getValidDocumentForUpdate(data) {
    if (Object.keys(data).length === 0) {
      return new Error('Required fields are missing');
    }

    let image = {};

    if (data.alt !== undefined) {
      image['images.$.alt'] = parse.getString(data.alt);
    }

    if (data.position !== undefined) {
      image['images.$.position'] = parse.getNumberIfPositive(data.position) || 0;
    }

    return image;
  }
}

module.exports = new ProductImagesService();
