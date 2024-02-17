# MineWatchAPI :pick: :mag_right:

> API de surveillance et de gestion de la base de donnée.

## Table des matières

- [Aperçu](#aperçu)
- [Captures d'écran](#captures-décran)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Contributions](#contributions)
- [Licence](#licence)

## Aperçu

MineWatchAPI est une API conçue pour surveiller et gérer les données d'une base de donnée. Elle offre une interface simple pour accéder aux informations de la table `table_joueurs` de votre base de données MySQL.

## Captures d'écran

<img src="https://sandro642.github.io/screenshots/consoleminewatchapi.png" alt="photo du terminal avec l'api lancé."/>

## Installation

1. Clonez ce dépôt : `git clone https://github.com/Sandro642/MineWatchAPI.git`
2. Vous pouvez utiliser `wget https://raw.githubusercontent.com/Sandro642/sandro642.github.io/main/shellscript/updaterapi.sh`
3. Installez les dépendances : `nmp run minewatch:linux/win:dependencies`

## Configuration

1. Modifiez les valeurs dans `config/config.js` pour correspondre à votre configuration de base de données.
2. Utilisez la commande `service editor config` pour modifier le fichier de configuration.

## Utilisation

1. Lancer l'application `npm run minewatch`
2. Pour lancer l'api, écrire dans le terminal `service api start`
3. Vous pouvez consulter la data depuis `http(s)://votreurl.com:8080`
4. Oû depuis le fichier json si vous l'avez éxecuté.
5. Vous pouvez mettre MineWatchAPI grâce à une seule commande en faisant `updater`. Il suffit juste de passer MineWatchAPI en version de développement. Prochainement en version current (latest).
6. Vous pouvez toujours exécuter la commande `help`.

## Contributions

Les contributions sont les bienvenues ! Pour les contributions majeures, veuillez d'abord ouvrir un problème pour discuter des changements proposés.

## Licence

Ce projet est sous licence MIT. Pour plus d'informations, consultez le fichier [LICENCE](LICENSE). 
