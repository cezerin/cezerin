#! /bin/bash
echo "Running startup-script"
apt-get update
apt-get install -y apt-transport-https ca-certificates curl software-properties-common

echo "Installing Docker CE"
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

apt-get update
apt-get install -y docker-ce

echo "Installing NGNX"
apt-get update && apt -y install nginx-full

echo "Installing NODE"
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -

echo "Update NPM"
npm i -g npm

echo "Installing PM2"
npm i -g pm2

echo "Running DB container"
docker run --name store-db -d -p 27017:27017 -v /var/www/store-db:/data/db mongo:latest

echo "Installing Cezerin"
cd /var/www
git clone https://github.com/UTipsProjects/ucommerce.git cezerin

echo "Installing dependencies"
cd ucommerce && npm i

echo "Building ucommerce"
npm run build

echo "UCOMMERCE READY"
echo "SSH in and run 'npm run setup <email-account> <domain-name>' to finish setup!"
echo "Run pm2 start process.json to start the application!"
