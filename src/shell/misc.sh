#!/bin/bash

echo: pm2 start ./src/api/api.js

echo: chmod u+x ./src/shell/dependencies.sh

echo: npm run minewatch:dependencies

echo: npm run minewatch:launch