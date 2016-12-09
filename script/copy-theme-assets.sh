#!/bin/bash

set -e

# delete current assets
rm -rf /var/www/cezerin/public/assets/

# copy theme assets
cp -r /var/www/cezerin/themes/current/assets/ /var/www/cezerin/public/assets/

echo -e '\e[1;92m'Assets successfully copied!'\e[0m'
