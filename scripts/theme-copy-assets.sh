#!/bin/bash
set -e

# create dir if not exists
mkdir -p public/assets

# delete current assets
rm -rf public/assets/

# copy theme assets
cp -r themes/current/assets/ public/assets/

echo -e '\e[1;92m'Assets successfully copied!'\e[0m'
