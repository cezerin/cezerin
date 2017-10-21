'use strict';

const path = require('path');
const fsExtra = require('fs-extra');
const fs = require('fs');
const url = require('url');
var formidable = require('formidable');
const utils = require('../lib/utils');
const settings = require('../lib/settings');

class FilesService {
  deleteFile(fileName) {
    return new Promise((resolve, reject) => {
      const filePath = path.resolve(settings.filesUploadPath + '/' + fileName);
      if(fs.existsSync(filePath)){
        fs.unlink(filePath, (err) => {
          resolve();
        })
      } else {
        reject('File not found');
      }
    });
  }

  uploadFile(req, res, next) {
    const uploadDir = path.resolve(settings.filesUploadPath);

    let form = new formidable.IncomingForm(),
        file_name = null,
        file_size = 0;

    form.uploadDir = uploadDir;

    form
      .on('fileBegin', (name, file) => {
        // Emitted whenever a field / value pair has been received.
        file.name = utils.getCorrectFileName(file.name);
        file.path = uploadDir + '/' + file.name;
      })
      .on('file', function(name, file) {
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
          res.send({ 'file': file_name, 'size': file_size });
        } else {
          res.status(400).send(this.getErrorMessage('Required fields are missing'));
        }
      });

    form.parse(req);
  }

  getErrorMessage(err) {
    return { 'error': true, 'message': err.toString() };
  }
}

module.exports = new FilesService();
