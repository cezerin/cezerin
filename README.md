# Cezerin

Cezerin is an open-source e-commerce platform built with JavaScript only. Cezerin makes it easy to create SEO-friendly single-page online store. [Demo store](https://store.cezerin.com).

![Cezerin dashboard](https://cezerin.com/assets/images/cezerin-dashboard.png)


## Build with

* NodeJS
* React
* Redux
* Express
* Babel ES6
* WebPack
* MongoDB


## Road Map

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
* Unfinished features **〈〈〈〈〈〈 we are here**
* Product options
* Product attributes
* Product tags
* Order details/edit/add
* Customer details/edit/add
* Documentation
* Central update
* Tests
* WebHooks
* Store: Services
* Store: Themes
* Theme settings in dashboard


## Installation

```shell
git clone https://github.com/cezerin/cezerin.git cezerin
cd cezerin
npm install
npm run build
node start
```
Then open <http://localhost:3000> to see your app.

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
└── app.json                 # pm2 process file
```


## Documentation

[API Documentation](https://doc.cezerin.com)


## Contributing

If you can, please contribute by reporting issues, discussing ideas, or submitting pull requests with patches and new features. We do our best to respond to all issues and pull requests within a day or two, and make patch releases to npm regularly.


## Licence

This software is provided free of charge and without restriction under the MIT License
