#!/bin/bash

# Déclaration du tableau de commandes
declare -a commands=(
    "echo 'Lancement du debug tool, V:DEV'"
    "./src/api/api.js"

)

# Parcourir et exécuter les commandes dans le tableau
for cmd in "${commands[@]}"; do
    echo "Exécution de la commande : $cmd"
    eval "$cmd"
    echo "------------------------------"
done
