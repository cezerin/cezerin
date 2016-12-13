'use strict';

const exec = require('child_process').exec;
const path = require('path');
const formidable = require('formidable');

class ThemesService {
  constructor() {}

  exportCurrentTheme(req, res) {
    exec('npm run theme:export', (error, stdout, stderr) => {
      if (error) {
        res.status(500).send(this.getErrorMessage(error));
      } else {
        if (stdout.endsWith('success')) {
          res.send({'file': 'themes/current/theme.zip'});
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
        exec(`npm run theme:install ${fileName} && npm run build:theme`, (error, stdout, stderr) => {
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
        let dir = path.resolve('themes');
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
