# Cezerin - Ecommerce Progressive Web Apps

React and Node.js based e-commerce platform. Single-Page Application. Progressive Web App. SEO-friendly. Built with Node.js v8.9, React v16, Redux, Express, Babel, WebPack v3 and MongoDB.


## Dashboard
Client-side dashboard use JSON Web Token (JWT) to access REST API.

![Cezerin Dashboard](https://cezerin.com/assets/images/cezerin-dashboard-products.png?)


## Store
Single-Page Application with React server-side rendering. [Demo store](https://store.cezerin.com)

[![Cezerin Store](https://cezerin.com/assets/images/cezerin-mobile-product.png)](https://store.cezerin.com)

[![Cezerin Store](https://cezerin.com/assets/images/cezerin-mobile-order-summary.png)](https://store.cezerin.com)

## Installation

### Requirements
* NodeJS >= 8
* NPM >= 5
* MongoDB >= 3.2


### Installation


```shell
git clone https://github.com/cezerin/cezerin.git cezerin
cd cezerin
npm install
npm run build
npm start
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
|`start`|Start node server.|


## Application Structure


```
.
├── config                   # Project and build configurations
├── dist                     # Distribution folder
├── locales                  # Text files
├── logs                     # Log files
├── public                   # Static public assets and uploads
│   ├── admin                # Dashboard index.html
│   ├── admin-assets         # Dashboard assets
│   └── content              # Store root folder
|
├── scripts                  # Shell scripts for theme install/export
├── src                      # Application source code
│   ├── admin                # Dashboard application
│   │   └── client           # Client side code
│   ├── api                  # REST API
│   │   └── server           # Server side code
│   ├── store                # Store application
│   |   ├── client             # Client side code
│   |   ├── server             # Server side code
│   |   └── shared             # Universal code
│   └── index.js             # Server application start point
├── theme                    # Theme as a local package
└── process.json             # pm2 process file
```


## Documentation

[Documentation](https://github.com/cezerin/cezerin/tree/master/docs)


## Contributing

If you can, please contribute by reporting issues, discussing ideas, or submitting pull requests with patches and new features. We do our best to respond to all issues and pull requests within a day or two, and make patch releases to npm regularly.


## Licence

This software is provided free of charge and without restriction under the MIT License
