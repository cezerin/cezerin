## Getting Started

* [Start a container](#1-start-a-container)
* [Configuration](#2-configuration)
* [Add default data](#3-add-default-data)

All you need to get started is an [installation](https://docs.docker.com/installation/#installation) of Docker.

### 1. Start a container

[Source code of Docker image](https://github.com/cezerin/docker-cezerin)

```shell
docker run \
      --name cezerin \
      -v /var/www/cezerin/db:/data/db \
      -p 3000:80 \
      cezerin/cezerin:latest
```

### 2. Configuration

Open config file in docker container

```shell
docker exec -it cezerin bash
cd config
nano server.js
```

Setting up a mail server. Cezerin is passwordless so we use the mail server to send login links.

```js
smtpServer: {
    host: 'smtp.mailgun.org',
    port: 465,
    secure: true,
    user: 'your smtp login',
    pass: 'your smtp password',
    fromName: 'Cezerin Store',
    fromAddress: 'mail@domain.com'
  }
```

Generate random secret key to sign JWT and cookies.

```js
jwtSecretKey: 'nySHI5DcpaIwqjEXJ1hO6E',
cookieSecretKey: '7efISpncZtDFgqamFY0Ozd',
```


### 3. Add default data

Open mongo Shell in docker container

```shell
docker exec -it cezerin bash
mongo shop
```

Add user mail@domain.com with admin permissions for 72 hours.

```js
db.tokens.insert({
  is_revoked: false,
  date_created: new Date(),
  expiration: 72,
  name: 'Owner',
  email: 'mail@domain.com',
  scopes: ['admin']  
});
```

Setting up your domain. Used in login URL.

```js
db.settings.insert({
  domain: 'http://localhost:3000'
});
```

Add common pages.

```js
db.pages.insertMany([
  {slug: '', meta_title: 'Home', enabled: true, is_system: true},
  {slug: 'checkout', meta_title: 'Checkout', enabled: true, is_system: true},
  {slug: 'checkout-success', meta_title: 'Thank You!', enabled: true, is_system: true}
]);
```


Open http://localhost:3000 to see your store.

Dashboard - http://localhost:3000/admin
