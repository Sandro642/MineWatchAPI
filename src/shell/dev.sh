#!/bin/bash

# Déclaration du tableau de commandes
declare -a commands=(
    "echo 'Exécution de api.js avec Node.js'"
    "node ./src/api/api.js"
    "echo 'Commande api.js terminée'"
)

# Parcourir et exécuter les commandes dans le tableau
for cmd in "${commands[@]}"; do
    echo "Exécution de la commande : $cmd"
    eval "$cmd"
    echo "------------------------------"
done
