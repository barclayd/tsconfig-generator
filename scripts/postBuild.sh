#!/bin/bash

cp -r ./src/templates ./dist/templates
cp -r ./src/scripts ./dist/scripts
ts-node ./scripts/productionPackageJson.ts
