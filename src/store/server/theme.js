import fs from 'fs'
import path from 'path'

let templateHtml = null;

export const readTemplate = () => {
  return new Promise((resolve, reject) => {
    if(templateHtml) {
      resolve(templateHtml);
    } else {
      const filePath = path.resolve('public/assets/index.html');
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
