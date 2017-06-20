const security = require('./security.js');
const settings = require('./settings.js');

let subscribers = [];

const THEME_INSTALLED = 'theme-installed';
const ORDER_RECEIVED = 'order-received';
const ORDER_CHANGED = 'order-changed';

const subscribe = (req, res) => {
  security.verifyToken(req.query.token, settings.jwtSecretKey).then(err => {
    if(err){
      res.status(403).end();
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no'
      });
      subscribers.push(res);
    }
  })
}

const sendMessage = (data) => {
  const json = JSON.stringify(data);
  for(var i = 0; i < subscribers.length; i++) {
    try{
      subscribers[i].write(`data: ${json}\n\n`);
    } catch(e){
      console.log(e)
    }
  }
}

module.exports = {
  subscribe,
  sendMessage,
  THEME_INSTALLED,
  ORDER_RECEIVED,
  ORDER_CHANGED
}
