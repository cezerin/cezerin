# How to deploy a Cezerin on Ubuntu 18.04.1 (from GitHub)

* [Requirements](#1-requirements)
* [Run MongoDB](#2-run-mongodb)
* [Run Cezerin](#3-run-cezerin)
* [Run Nginx](#4-run-nginx)
* [What's next](#5-whats-next)

## 1. Requirements
I'll use [DigitalOcean](https://www.digitalocean.com/) to deploy Cezerin.
My droplet :
 - Choose an image: `Ubuntu 18.04.1 x64`
 - Choose a size: `1 GB (RAM), 1 vCPU, 25 GB (SSD)`

We need to install:

1. Docker `18.06.0-ce`

    [Get Docker CE for Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-ce)

    We'll use Docker to run MongoDB in container. You may not need it.

2. Nginx `1.14.0`
    ```shell
    apt update && apt install nginx-full
    ```

3. Node `v8.11.3`

    [Installing Node.js via package manager](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)

4. Update NPM `6.3.0`
    ```
    npm i -g npm
    ```

4. PM2 `3.0.3`
    ```
    npm i -g pm2
    ```

## 2. Run MongoDB
```shell
docker run --name store-db -d -p 27017:27017 -v /var/www/store-db:/data/db mongo:latest
```

## 3. Run Cezerin
1. Clone a Git repository
    ```shell
    cd /var/www
    git clone https://github.com/cezerin/cezerin
    ```
2. Change setting
    ```
    cd cezerin/config
    mv admin.production.js admin.js
    mv store.production.js store.js
    mv server.production.js server.js
    ```
    
    Open `server.js` and change

    - SMTP server
        ```js
        smtpServer: {
            host: '',
            port: 0,
            secure: true,
            user: '',
            pass: '',
            fromName: '',
            fromAddress: ''
        },
        ```

    - Generate new values for secret keys
        ```js
        // key to sign tokens
        jwtSecretKey: '...',

        // key to sign store cookies
        cookieSecretKey: '...',
        ```

    Save file and go back to root app directory.
    ```
    cd ../
    ```
3. Install dependencies
    ```
    npm i
    ```
4. Build project
    ```
    npm run build
    ```
5. Prepare database
    At this step our database is empty. To add default data, indexes and access token we need to run:

    ```
    npm run setup <email> <domain>
    ```
    I don't have domain, so I'll use my server ip:
    ```
    npm run setup admin@website.com http://142.93.0.0
    ```

    This script will add token with email admin@website.com and set my doman to http://142.93.0.0


6. Start an application
    ```
    pm2 start process.json
    ```
    At this step, we have 2 applications (**api** and **store**) running on port **3001** and **3000**.

## 4. Run Nginx
We need to add a new website to Nginx.
1. Change Nginx config file
    ```
    cd /etc/nginx/sites-available
    ```

    open `default` file and paste [this config](./nginx.md)
2. Reload Nginx configuration
    ```
    nginx -t && service nginx reload
    ```

## 4. What's next
At this step, I have my website on http://142.93.0.0. I can go to the dashboard on http://142.93.0.0/admin with email: admin@website.com. SMTP server from `config/server.js` will send me an email with a link to sign in.

Next steps:
1. Setup domain
2. Setup HTTPS with [CloudFlare](https://www.cloudflare.com/) or [Let's Encrypt](https://letsencrypt.org/)
3. Secure a MongoDB
4. Configure a Firewall