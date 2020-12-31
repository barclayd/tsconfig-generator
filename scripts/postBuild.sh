#!/bin/bash

cp -r ./src/templates ./dist/templates
rsync -a . ./dist/templates/npx --exclude .idea --exclude node_modules --exclude dist --exclude src --exclude .git --exclude code
mkdir ./dist/templates/npx/src && touch ./dist/templates/npx/src/index.ts
cp -r ./src/scripts ./dist/scripts
cp ./PACKAGE_README.md ./dist/README.md
ts-node ./scripts/productionPackageJson.ts
