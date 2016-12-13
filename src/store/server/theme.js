import fs from 'fs'
import path from 'path'

let templateHtml = null;
let buildManifestJSON = null;

export const readTemplate = () => {
  return new Promise((resolve, reject) => {
    if(templateHtml) {
      resolve(templateHtml);
    } else {
      const filePath = path.resolve('themes/current/template.html');
      fs.readFile(filePath, 'utf8', (err, data) => {
        if(err) {
          reject(err);
        } else {
          templateHtml = data;
          resolve(templateHtml);
        }
      });
    }
  });
}

export const readBuildManifest = () => {
  return new Promise((resolve, reject) => {
    if(buildManifestJSON) {
      resolve(buildManifestJSON);
    } else {
      const filePath = path.resolve('public/assets/js/build-manifest.json');
      fs.readFile(filePath, 'utf8', (err, data) => {
        if(err) {
          reject(err);
        } else {
          buildManifestJSON = JSON.parse(data);
          resolve(buildManifestJSON);
        }
      });
    }
  });
}
