import fs from 'fs'
import path from 'path'

const THEME_LOCALES_PATH = 'public/assets/locales/';
let text = null;

export const getText = (locale) => {
  if(text) {
    return Promise.resolve(text);
  } else {
    const filePath = path.resolve(THEME_LOCALES_PATH + locale + '.json');
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if(err){
          reject(err)
        } else {
          text = JSON.parse(data);
          resolve(text);
        }
      });
    });
  }
}
