#!/bin/bash
set -e

# first argument is *.zip file name
fileName=$1

if [ $# -eq 0 ]; then
    echo "No arguments supplied"
    exit 1
fi

# 1. check file exists
if [ ! -f "public/content/$fileName" ]; then
    echo "File not found!"
    exit 1
fi

# 3. remove all the contents of theme folder
rm -rf theme/*

# 4. unzip to current theme
unzip -q "public/content/$fileName" -d "theme"

# 5. build theme
npm run theme:build

# 6. show success message
echo -e '\e[1;92m'Theme $fileName successfully installed'\e[0m'
