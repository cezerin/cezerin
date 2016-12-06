var SitemapService = require('../services/sitemap');

var slug = require('slug');
var slugConfig = {
    symbols: false,         // replace unicode symbols or not
    remove: null,          // (optional) regex to remove characters
    lower: true           // result in lower case
};

const cleanSlug = (text) => {
  return slug(text || '', slugConfig);
}

const getAvailableSlug = (path, resource) => {
  return SitemapService.getPaths()
  .then(paths => {
    path = cleanSlug(path);
    let pathExists = paths.find(e => e.path === path && e.resource != resource);
    while(pathExists) {
      path += '-2';
      pathExists = paths.find(e => e.path === path && e.resource != resource);
    }
    return path;
  })
}

module.exports = {
  cleanSlug: cleanSlug,
  getAvailableSlug: getAvailableSlug
}
