var SitemapService = require('../services/sitemap');
var CategoriesService = require('../services/products/categories');

var slug = require('slug');
var slugConfig = {
    symbols: false,         // replace unicode symbols or not
    remove: null,          // (optional) regex to remove characters
    lower: true           // result in lower case
};

cleanSlug = (text) => {
  return slug(text || '', slugConfig);
}

getAvailableSlug = (path, resource) => {
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

getProductCategorySlug = (category_id) => {
  const language = 'en';
  return CategoriesService.getSingleCategory(language, category_id)
  .then(item => {
    return item.slug;
  })
}

module.exports = {
  cleanSlug: cleanSlug,
  getAvailableSlug: getAvailableSlug,
  getProductCategorySlug: getProductCategorySlug
}
