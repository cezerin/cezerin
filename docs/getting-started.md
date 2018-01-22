## Getting Started

* [Installation](#1-installation)
* [Configuration](#2-configuration)
* [Run Application](#3-run-application)
* [Add default data](#4-add-default-data)

### 1. Installation

```shell
git clone https://github.com/cezerin/cezerin.git cezerin
cd cezerin
npm install
npm run build
```

### 2. Configuration

1. open config/server.js
2. connecting to your MongoDB
```js
mongodbServerUrl: 'mongodb://127.0.0.1:27017/shop'
```

### 3. Run Application

```shell
npm start
```

### 4. Add default data

1. open mongo shell
2. setting up your domain
```js
db.settings.insert({
  domain: 'http://localhost:3000'
});
```
3. add common pages
```js
db.pages.insertMany([
  {slug: '', meta_title: 'Home', enabled: true, is_system: true},
  {slug: 'checkout', meta_title: 'Checkout', enabled: true, is_system: true},
  {slug: 'checkout-success', meta_title: 'Thank You!', enabled: true, is_system: true}
]);
```

Open http://localhost:3000 to see your store.

Dashboard - http://localhost:3000/admin

API - http://localhost:3001
