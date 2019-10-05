#!/bin/bash
set -e

# 1.first argument is *.zip file name
fileName="theme.zip"

# 2. change fileName if arg passed
if [ $# -ne 0 ]; then
    fileName=$1
fi

# 3. delete zip if exists
if [ -f "public/content/$fileName" ]; then
    rm public/content/$fileName
fi

# 4. zip current theme
cd theme
zip -rq9 ../public/content/$fileName . -x node_modules\* dist\* assets/index.html assets/js/bundle-\* assets/css/bundle-\*

# 5. show success message
echo success
