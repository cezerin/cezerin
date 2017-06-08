# Cezerin

Cezerin is an open-source e-commerce platform built with JavaScript only. Cezerin makes it easy to create SEO-friendly single-page online store.

[Demo store](https://store.cezerin.com)

[Demo dashboard (read only)](https://store.cezerin.com/admin/login?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InB1YmxpY0BjZXplcmluLmNvbSIsInNjb3BlcyI6WyJyZWFkOnNldHRpbmdzIiwicmVhZDpwYXltZW50X21ldGhvZHMiLCJyZWFkOnNoaXBwaW5nX21ldGhvZHMiLCJyZWFkOnNpdGVtYXAiLCJyZWFkOnRoZW1lcyIsInJlYWQ6b3JkZXJfc3RhdHVzZXMiLCJyZWFkOnBhZ2VzIiwicmVhZDpjdXN0b21lcl9ncm91cHMiLCJyZWFkOmN1c3RvbWVycyIsInJlYWQ6b3JkZXJzIiwicmVhZDpwcm9kdWN0X2NhdGVnb3JpZXMiLCJyZWFkOnByb2R1Y3RzIiwiZGFzaGJvYXJkIl0sImp0aSI6IjU5MzkyZjRkMWMwYTQzMDEyMDE2YmEyNSIsImlhdCI6MTQ5NjkxOTg4NSwiZXhwIjoxNTEyNDcxODg1fQ._x3vJ9NoBL1zdNwFvTRFvAQv3HbwCeW53yt14hRm99U)

![Cezerin dashboard](https://cezerin.com/assets/images/cezerin-dashboard.png)


## Build with

* NodeJS
* React
* Redux
* Express
* Babel ES6
* WebPack
* MongoDB


## Roadmap

* ~~**Products**~~
* ~~**Template**~~
* ~~**Customers**~~
* ~~**Orders**~~
* ~~**Settings**~~
* ~~**Custom pages**~~
* ~~**Security**~~
* ~~**Performance**~~
* ~~**Refactoring**~~
* ~~**Default theme**~~
* ~~**Unfinished features**~~
* ~~**Product options**~~
* ~~**Order details/edit/add**~~
* ~~**Customer details/edit/add**~~
* ~~**Google Analytics for Single Page Application**~~

**Short-term (next 3 months)**
* Order notifications
* Order Timeline
* Order Statuses
* Related Products
* Product Faceted Search
* Product tags
* PWA template
* Central update
* Store: Services

**Long-term**
* Tests (REST API, React, server)
* Documentation
* WebHooks
* Store: Themes
* Theme settings in dashboard (menus, galleries, etc)
* Customer account
* Social login
* Dashboard analytics & metrics
* Dashboard Real-Time analytics
* API to manage URL redirects
* Shipping rate real time
* Product discount
* Order discounts
* Geolocation
* PWA (offline, push notifications)


## Installation

### Requirements
* NodeJS
* NPM
* MongoDB


### Installation

```shell
git clone https://github.com/cezerin/cezerin.git cezerin
cd cezerin
npm install
npm run build
node start
```

Then open <http://localhost:3000> to see your app.

[Configuration details](https://docs.cezerin.com/configuration.html)


|`npm run <script>`|Description|
|------------------|-----------|
|`clean:admin`|Delete admin asset bundles.|
|`clean:store`|Delete store asset bundles.|
|`compile:dev`|Compiles the application to disk **and watch** (`~/dist` by default).|
|`compile`|Compiles the application to disk (`~/dist` by default).|
|`webpack:admin:dev`|Assemble admin bundles **and watch**.|
|`webpack:store:dev`|Assemble store bundles **and watch**.|
|`webpack:admin:prod`|Assemble admin bundles.|
|`webpack:store:prod`|Assemble store bundles.|
|`theme:install`|Install theme from /public/<file>.zip|
|`theme:export`|Zip current theme to /public/<file>.zip|
|`theme:copy`|Compile theme and copy assets to /public/|
|`theme:build:dev`|Refresh theme after modification **and watch**.|
|`theme:build:prod`|Refresh theme after modification.|
|`build:dev`|Compile and assemble bundles **and watch**.|
|`build`|Compile and assemble bundles.|
|`start:dev`|Start node server **and watch**.|
|`start`|Start node server.|


## Application Structure


```
.
├── config                   # Project and build configurations
├── locales                  # Text files
├── logs                     # Log files
├── public                   # Static public assets and uploads
├── scripts                  # Shell scripts for theme install/export
├── dist                     # Distribution folder
├── src                      # Application source code
│   ├── admin                # Admin application
│   │   └── client           # Client side code
│   ├── api                  # REST API
│   │   └── server           # Server side code
│   ├── store                # Store application
│   |   ├── client             # Client side code
│   |   ├── server             # Server side code
│   |   └── shared             # Universal code
│   └── index.js             # Server application start point
├── themes                   # Themes
└── process.json                 # pm2 process file
```


## Documentation

[Documentation](https://github.com/cezerin/cezerin/wiki)

[API Documentation](https://api.cezerin.com)


## Contributing

If you can, please contribute by reporting issues, discussing ideas, or submitting pull requests with patches and new features. We do our best to respond to all issues and pull requests within a day or two, and make patch releases to npm regularly.


## Licence

This software is provided free of charge and without restriction under the MIT License
