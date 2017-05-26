import fs from 'fs'
import path from 'path'

const FILE_PATH = path.resolve('public/assets/index.html');
export let indexHtml = null;

fs.readFile(FILE_PATH, 'utf8', (err, data) => {
  indexHtml = err ? err : data;
});
