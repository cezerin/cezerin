var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var apiRouter = require('./api/server');
const settings = require('./store/server/lib/settings');
var nunjucks = require('nunjucks');
nunjucks.configure('./public/themes', { autoescape: true, watch: true });

var api = require('cezerin-client');
api.init(
	settings.api.url.base,
	settings.api.language.default,
	settings.api.token);

app.disable('x-powered-by');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  api.products.categories.list().then(({status, json}) => {
		let html = nunjucks.render('index.html', {
      title: 'Store index page',
      categories: json,
      func: (arg) => { return "func result."+arg }
    });


    res.send(html);
  });
});

app.use('/api', apiRouter);

const server = app.listen(3000, () => {
  var host = server.address().address;
  host = (host === '::' ? 'localhost' : host);
  var port = server.address().port;
  console.log(`${new Date()} - server start at ${host}:${port}`);
});
