#!/bin/bash

cp -r ./src/templates ./dist/templates
rsync -a . ./dist/templates/npx --exclude .idea --exclude node_modules --exclude dist --exclude src --exclude .git --exclude code --exclude temp --exclude README.md
mv ./dist/templates/npx/package.json ./dist/templates/npx/old-package.json
mv ./dist/templates/npx/.gitignore ./dist/templates/npx/gitignore
touch ./dist/templates/npx/README.md
mkdir ./dist/templates/npx/src
touch ./dist/templates/npx/src/index.ts
{
  echo "#!/usr/bin/env node"
} >> ./dist/templates/npx/src/index.ts
touch ./dist/templates/npx/src/index.ts
cp -r ./src/scripts ./dist/scripts &>/dev/null
cp ./PACKAGE_README.md ./dist/README.md
ts-node ./scripts/productionPackageJson.ts
