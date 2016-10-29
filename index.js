var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var apiRouter = require('./api/server')

var nunjucks = require('nunjucks')
nunjucks.configure('./public/themes/template', { autoescape: true, watch: true });

const settings = require('./store/server/lib/settings');
var api = require('cezerin-client');
api.init(
	settings.api.url.base,
	settings.api.language.default,
	settings.api.token);

// var bunyan = require('bunyan');
// var parser = require('accept-language-parser');



// var auth = require('./lib/auth');
// var mongo = require('./lib/mongo');
// var utils = require('./lib/utils');

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

// var log = bunyan.createLogger({
//     name: 'home',
//     streams: [{
//         path: './log/logs.log'
//     }]
// });

// process.on('uncaughtException', function(err) {
//   log.error(err);
// });

// var transport = nodemailer.createTransport(smtpTransport({
//     host: 'smtp.sendgrid.net',
//     port: 465,
//     secure: true,
//     auth: {
//         user: 'AKIAIRTRQT6R3M2L47IQ',
//         pass: 'Al0yBtMomydpj9mVAmD6mFDyGChHY4Gt25E+WWgFkTjw'
//     }
// }));

// app.use(function(err, req, res, next) {
//   if(err && err.name === 'UnauthorizedError') {
//     res.status(401).send({ 'error': err.message });
//   } else if(err) {
//     res.status(500).send({ 'error': err });
//   } else {
//     next();
//   }
// });


const server = app.listen(3000, () => {
  var host = server.address().address;
  host = (host === '::' ? 'localhost' : host);
  var port = server.address().port;
  console.log(`${new Date()} - server start at ${host}:${port}`);
});
