# Initialize MongoDB

* [Adding common pages](#adding-common-pages)
* [Adding a User](#adding-a-user)
* [Setting up a mail server](#setting-up-a-mail-server)
* [Settings](#settings)
* [Create indexes](#create-indexes)

Open `mongo` shell and execute scripts.

## Adding common pages

```js
db.pages.insertMany([
  {slug: '', meta_title: 'Home', enabled: true, is_system: true},
  {slug: 'checkout', meta_title: 'Checkout', enabled: true, is_system: true},
  {slug: 'checkout-success', meta_title: 'Thank You!', enabled: true, is_system: true},
  {slug: 'cart', meta_title: 'Cart', enabled: true, is_system: true},
  {slug: 'login', meta_title: 'Login', enabled: true, is_system: true},
  {slug: 'logout', meta_title: 'Logout', enabled: true, is_system: true},
  {slug: 'register', meta_title: 'Register', enabled: true, is_system: true},
  {slug: 'account', meta_title: 'Account', enabled: true, is_system: true}
]);
```

## Adding a User

```js
db.tokens.insert({
  is_revoked: false,
  date_created: new Date(),
  expiration: 72,
  name: 'Owner',
  email: 'email@domain.com',
  scopes: ['admin']  
});
```

## Setting up a mail server

```js
db.emailSettings.insert({
  host: 'smtp.domain.com',
  port: 465,
  user: '',
  pass: '',
  from_name: 'Store',
  from_address: 'email@domain.com'
});
```

## Create indexes

```js
db.pages.createIndex({ enabled: 1 });
db.pages.createIndex({ slug: 1 });
db.productCategories.createIndex({ enabled: 1 });
db.productCategories.createIndex({ slug: 1 });
db.products.createIndex({ slug: 1 });
db.products.createIndex({ enabled: 1 });
db.products.createIndex({ category_id: 1 });
db.products.createIndex({ sku: 1 });
db.products.createIndex({'attributes.name' : 1, 'attributes.value' : 1});
db.products.createIndex({
  'name': 'text',
  'description': 'text'
}, { default_language: 'english', name: 'textIndex' });
db.customers.createIndex({ group_id: 1 });
db.customers.createIndex({ email: 1 });
db.customers.createIndex({ mobile: 1 });
db.customers.createIndex({
  'full_name': 'text',
  'addresses.address1': 'text'
}, { default_language: 'english', name: 'textIndex' });
db.orders.createIndex({ draft: 1 });
db.orders.createIndex({ number: 1 });
db.orders.createIndex({ customer_id: 1 });
db.orders.createIndex({ email: 1 });
db.orders.createIndex({ mobile: 1 });
db.orders.createIndex({
  'shipping_address.full_name': 'text',
  'shipping_address.address1': 'text'
}, { default_language: 'english', name: 'textIndex' });
```
