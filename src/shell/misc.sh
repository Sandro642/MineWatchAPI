#!/bin/bash

echo "Lancement de pm2 pour api.js"
pm2 start ./src/api/api.js

echo "Modification des permissions pour dependencies.sh"
chmod u+x ./src/shell/dependencies.sh

echo "Exécution de minewatch:dependencies"
npm run minewatch:dependencies

echo "Exécution de minewatch:launch"
npm run minewatch:launch
