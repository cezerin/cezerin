#!/bin/bash
set -e

# first argument is *.zip file name
fileName=$1

if [ $# -eq 0 ]; then
    echo "No arguments supplied"
    exit 1
fi

# 1. check file exists
if [ ! -f "public/$fileName" ]; then
    echo "File not found!"
    exit 1
fi

# 2. create dir if not exists
mkdir -p themes/current

# 3. delete current theme
rm -rf themes/current/

# 4. unzip to current theme
unzip -q "public/$fileName" -d "themes/current"

# 5. show success message
echo -e '\e[1;92m'Theme $fileName successfully installed'\e[0m'
