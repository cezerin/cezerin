import fs from 'fs'
import path from 'path'
const INDEX_HTML_PATH = path.resolve('public/assets/index.html');
let templateHtml = null;

export const readIndexHtmlFile = () => {
  return new Promise((resolve, reject) => {
    if(templateHtml) {
      resolve(templateHtml);
    } else {
      fs.readFile(INDEX_HTML_PATH, 'utf8', (err, data) => {
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
