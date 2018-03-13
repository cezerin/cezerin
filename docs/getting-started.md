# Getting Started

* [Installation](#1-installation)
* [Run Application](#2-run-application)
* [Configuration](#3-configuration)
* [Add default data](#4-add-default-data)

## 1. Installation

### Requirements
- Node.js >= 8
- MongoDB >= 3.2

```shell
git clone https://github.com/cezerin/cezerin.git cezerin
cd cezerin
npm install
npm run build
```

## 2. Run Application

```shell
npm start
```

Also, you can run application with PM2 and watch for modifications.
1. Install PM2 globally
```
npm install pm2 -g
```
2. Run application
```shell
pm2 start process.json
```

Open http://localhost:3000 to see your store.  
Dashboard - http://localhost:3000/admin  
API - http://localhost:3001

## 3. Configuration

By default MongoDB connection string is `mongodb://127.0.0.1:27017/shop`

Change it with environment variables

```shell
DB_HOST=255.255.255.255 \
DB_PORT=27017 \
DB_NAME=shop \
DB_USER=user \
DB_PASS=password \
npm start
```

## 4. Add default data

You need to manually add default data to MongoDB. [Initialize MongoDB.](https://github.com/cezerin/cezerin/blob/master/docs/initialize-mongodb.md)
