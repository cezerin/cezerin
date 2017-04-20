'use strict';

const exec = require('child_process').exec;
const path = require('path');
const formidable = require('formidable');
const settings = require('../../lib/settings');

class ThemesService {
  constructor() {}

  exportCurrentTheme(req, res) {
    const randomFileName = Math.floor(Math.random() * 10000);
    exec(`npm --silent run theme:export -- ${randomFileName}.zip`, (error, stdout, stderr) => {
      if (error) {
        res.status(500).send(this.getErrorMessage(error));
      } else {
        if (stdout.includes('success')) {
          res.send({'file': `/${randomFileName}.zip`});
        } else {
          res.status(500).send(this.getErrorMessage('Something went wrong in scripts'));
        }
      }
    });
  }

  installTheme(req, res) {
    this.saveThemeFile(req, res, (err, fileName) => {
      if (err) {
        res.status(500).send(this.getErrorMessage(err));
      } else {
        exec(`npm run theme:install ${fileName} && npm run theme:build:prod`, (error, stdout, stderr) => {
          if (error) {
            res.status(500).send(this.getErrorMessage(error));
          } else {
            res.send({'success': true, 'warn': stderr});
          }
        });
      }
    });
  }

  saveThemeFile(req, res, callback) {
    let form = new formidable.IncomingForm(),
      file_name = null,
      file_size = 0;

    form.multiples = false;

    form.on('fileBegin', (name, file) => {
      // Emitted whenever a field / value pair has been received.
      if (file.name.endsWith('.zip')) {
        let dir = path.resolve('public');
        file.path = dir + '/' + file.name;
      }
      // else - will save to /tmp
    }).on('file', function(field, file) {
      // every time a file has been uploaded successfully,
      if (file.name.endsWith('.zip')) {
        file_name = file.name;
        file_size = file.size;
      }
    }).on('error', (err) => {
      callback(err);
    }).on('end', () => {
      //Emitted when the entire request has been received, and all contained files have finished flushing to disk.
      if (file_name) {
        callback(null, file_name);
      } else {
        callback('Cant upload file');
      }
    });

    form.parse(req);
  }

  getErrorMessage(err) {
    return {'error': true, 'message': err.toString()};
  }
}

module.exports = new ThemesService();
