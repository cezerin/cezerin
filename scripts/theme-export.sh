#!/bin/bash
set -e

# first argument is *.zip file name
fileName="theme.zip"

# 1. change fileName if arg passed
if [ $# -ne 0 ]; then
    fileName=$1
fi

# 2. delete zip if exists
if [ -f "public/content/$fileName" ]; then
    rm public/content/$fileName
fi

# 3. zip current theme
cd theme
zip -rq9 ../public/content/$fileName . -x node_modules\* dist\* assets/index.html assets/js/bundle-\* assets/css/bundle-\*

# 4. show success message
echo success
