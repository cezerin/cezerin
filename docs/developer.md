## Developer Install Guide

* [Get the latest version](#1-get-the-latest-version)
* [Build](#2-Build)
* [Start a container](#3-start-a-container)
* [Modify theme](#4-modify-theme)

### Requirements
* Node.js >= 8
* npm >= 5

### Paths
* /var/www/cezerin/db - MongoDB data files
* /var/www/cezerin/cezerin - Web project

### 1. Get the latest version

```shell
cd /var/www/cezerin/
git clone https://github.com/cezerin/cezerin.git cezerin
```

### 2. Build

Install node packages. Build project and theme. Build and watch for changes.

On changes, Babel and WebPack will fire.

```shell
cd /var/www/cezerin/cezerin
npm i
npm run build
npm run build:dev
```

### 3. Start a container

Run Docker container on port 3000 and map to host directories. Container contains Nginx, Mongo and Node.js.
[Source code of Docker image.](https://github.com/cezerin/docker-cezerin)

On changes, PM2 will restart application.

```shell
docker run \
      --name cezerin \
      -v /var/www/cezerin/db:/data/db \
      -v /var/www/cezerin/cezerin:/var/www/cezerin \
      -p 3000:80 \
      cezerin/cezerin:latest
```

### 4. Modify theme

For example you modify *theme/src/components/footer.js*

After you save changes:
1. Babel will compile
2. WebPack will create a bundle
3. PM2 reload application

Now you can refresh your browser to see changes.



### NPM Scripts

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
