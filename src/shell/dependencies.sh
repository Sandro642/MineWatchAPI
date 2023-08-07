#!/bin/bash

# Fonction pour installer une dépendance via npm s'il n'est pas déjà installé
function install_if_not_exists() {
    if ! npm list "$1" > /dev/null 2>&1; then
        echo "Installation de $1..."
        npm "$1"
    else
        echo "$1 est déjà installé."
    fi
}

# Installer les dépendances souhaitées
install_if_not_exists "install express"
install_if_not_exists "install mysql2"
install_if_not_exists "install colors"
install_if_not_exists "install -g pm2"

#Last command
install_if_not_exists "install"
# Ajoutez d'autres dépendances souhaitées ici

echo "Toutes les installations npm sont terminées."
