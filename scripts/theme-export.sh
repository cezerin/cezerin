#!/bin/bash
set -e

# first argument is *.zip file name
fileName="theme.zip"

# 1. change fileName if arg passed
if [ $# -ne 0 ]; then
    fileName=$1
fi

# 2. zip current theme
cd themes/current
zip -rq9 ../$fileName . -x node_modules\* dist\*

# 3. show success message
echo success
