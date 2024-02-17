require('colors');

const readline = require('readline');
const fs = require('fs');
const mysql = require('mysql');
const config = require('../../root/config/minewatchconfig');
let { closeConnection, establishConnection, data, urlJsonFile } = require('../api/api');
const version = require ('../../root/mwapi/js/checkerVersion');
const logger = require("../../root/misc/logger");
let { jsonapi } = require("../../root/mwapi/js/checkerJson");

const checkAndUpdate = require('../misc/updater');

let configchanged = {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'database',
    port: 3306
};

try {
    const existingConfig = require('../../root/config/minewatchconfig');
    configchanged = { ...config, ...existingConfig };
} catch (error) {
    // Si le fichier de configuration n'existe pas encore, il sera créé avec les valeurs par défaut
}


if (version === "latest") {

    const prefix = '\n[MineWatchAPI] '.blue;
    const errormsg = prefix + 'Commande inconnue. Tapez "help" pour obtenir de l\'aide.\n';

    function createCLI() {
        const dbConnection = mysql.createConnection(config);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'console'.blue + '@'.white + 'MineWatchAPI-$'.green + ' ' // Personnalisez le prompt ici
        });

        function help() {
            console.log(prefix + "Commandes disponibles :\n" +
                "            - help : Affiche l'aide.\n" +
                "            - assist : Fournit une assistance.\n" +
                "            - service api start : Démarre le service API.\n" +
                "            - service api stop : Arrête le service API.\n" +
                "            - service editor config : Accède à l'éditeur de config.\n" +
                "            - service editor json : Accède à l'éditeur de JsonAPI.\n" +
                "            - clear : Efface l'écran.\n" +
                "            - exit : Quitte l'application.\n");

            rl.prompt();
        }

        function editConfig() {
            console.clear();
            console.log(logger.message.green);
            rl.question('Entrez le nom d\'hôte : ', (host) => {
                config.host = host;
                console.clear();

                rl.question('Entrez le nom d\'utilisateur : ', (user) => {
                    config.user = user;
                    console.clear();

                    rl.question('Entrez le mot de passe : ', (password) => {
                        config.password = password;
                        console.clear();

                        rl.question('Entrez le nom de la base de données : ', (database) => {
                            config.database = database;
                            console.clear();

                            rl.question('Entrez le port : ', (port) => {
                                config.port = port;
                                console.clear();

                                const configContent = `
const minewatchconfig = {
host: '${config.host}',
user: '${config.user}',
password: '${config.password}',
database: '${config.database}',
port: ${config.port}
};

module.exports = minewatchconfig;
`;

                                fs.writeFileSync('src/root/config/minewatchconfig.js', configContent);
                                console.clear();

                                rl.prompt();

                                console.log('\nLes données de configuration ont été mises à jour.');
                            });
                        });
                    });
                });
            });
        }

        function editJson() {

            console.clear();
            console.log(logger.message.green);
            rl.question('Avez-vous le tableau json quand vous allez sur lurl api.js ? (y/n) : ', (answer) => {
                if (answer === "y") {
                    console.clear();

                    rl.question('Entrez lurl du fichier json : ', (url) => {
                        console.clear();
                        urlJsonFile = url;
                        jsonapi = true;

                        console.log("Fin de l'édition du fichier json.mwapi");
                        rl.prompt();
                    });

                } else if (answer === "n") {
                    console.clear();
                    jsonapi = false;

                    console.log("Fin de l'édition du fichier json.mwapi");
                    rl.prompt();
                }
            });
        }

        rl.prompt();

        rl.on('line', async (input) => {
            const args = input.trim().split(' ');


            switch (args[0]) {
                case 'help':
                    help();
                    break;

                case 'assist':
                    console.log(prefix + 'Assistance :');
                    console.log("L'assistance n'est pas encore disponible.\n");
                    break;

                case 'service':
                    if (args.length < 2) {
                        console.log("Commande 'service' nécessite un sous-argument.\n");
                        break;
                    }
                    switch (args[1]) {
                        case 'api':
                            if (args.length < 3) {
                                console.log("Commande 'service api' nécessite un sous-argument.\n");
                                break;
                            }
                            switch (args[2]) {
                                case 'start':
                                    console.log(prefix + 'Démarrage du service API...');
                                    console.log(prefix + 'Connexion à la base de données...\n');
                                    await establishConnection();
                                    break;

                                case 'stop':
                                    console.log(prefix + 'Arrêt du service API...');
                                    console.log(prefix + 'Fermeture de la connexion à la base de données...\n');
                                    await closeConnection();
                                    break;

                                default:
                                    console.log("Sous-commande 'start' ou 'stop' attendue pour 'service api'.\n");
                                    break;
                            }
                            break;

                        case 'editor':
                            if (args.length < 3) {
                                console.log("Commande 'service api' nécessite un sous-argument.\n");
                                break;
                            }
                            switch (args[2]) {
                                case 'config':
                                    console.log(prefix + 'Ouverture de l\'éditeur de configuration...');
                                    editConfig();
                                    break;

                                case 'json':
                                    console.log(prefix + 'Ouverture de l\'éditeur de JsonAPI...');
                                    editJson();
                                    break;


                                default:
                                    console.log("Sous-commande 'config attendue pour 'service editor'.\n");
                                    break;
                            }
                            break;

                        default:
                            console.log("Sous-commande 'api' ou 'editor' attendue pour 'service'.\n");
                            break;
                    }
                    break;

                case 'clear':
                    console.log(prefix + 'Effacement de l\'écran...');
                    console.clear();
                    break;

                case 'exit':
                    console.log(prefix + 'Fermeture de l\'application...\n');
                    setTimeout( () => {
                        rl.close();
                    }, 3000);
                    break;

                default:
                    console.log(errormsg);
                    break;
            }

            rl.prompt();
        });

        rl.on('close', () => {
            // Fermer la connexion à la base de données avant de quitter l'application
            dbConnection.end((err) => {
                if (err) {
                    console.error('Erreur lors de la fermeture de la connexion à la base de données :', err.message);
                } else {
                    console.log('Connexion à la base de données fermée.');
                }
                console.log('\nAu revoir !\n');
                console.clear();
                process.exit(0);
            });
        });
    }

    module.exports = createCLI;

}

else if (version === "dev") {

    const prefix = '\n[MineWatchAPI] '.blue;
    const errormsg = prefix + 'Commande inconnue. Tapez "help" pour obtenir de l\'aide.\n';

    function createCLI() {
        const dbConnection = mysql.createConnection(config);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: 'console'.blue + '@'.white + 'MineWatchAPI-$'.green + ' ' // Personnalisez le prompt ici
        });

        function help() {
            console.log(prefix + "Commandes disponibles :\n" +
                "            - help : Affiche l'aide.\n" +
                "            - assist : Fournit une assistance.\n" +
                "            - service api start : Démarre le service API.\n" +
                "            - service api stop : Arrête le service API.\n" +
                "            - service editor config : Accède à l'éditeur de config.\n" +
                "            - service editor json : Accède à l'éditeur de JsonAPI.\n" +
                "            - debug : Affiche les données de débogage.\n" +
                "            - updater : Met à jour l'API.\n" +
                "            - clear : Efface l'écran.\n" +
                "            - exit : Quitte l'application.\n");

            rl.prompt();
        }

        function editConfig() {
            rl.question('Entrez le nom d\'hôte : ', (host) => {
                config.host = host;
                console.clear();

                rl.question('Entrez le nom d\'utilisateur : ', (user) => {
                    config.user = user;
                    console.clear();

                    rl.question('Entrez le mot de passe : ', (password) => {
                        config.password = password;
                        console.clear();

                        rl.question('Entrez le nom de la base de données : ', (database) => {
                            config.database = database;
                            console.clear();

                            rl.question('Entrez le port : ', (port) => {
                                config.port = port;
                                console.clear();

                                const configContent = `
const minewatchconfig = {
host: '${config.host}',
user: '${config.user}',
password: '${config.password}',
database: '${config.database}',
port: ${config.port}
};

module.exports = minewatchconfig;
`;

                                fs.writeFileSync('src/root/config/minewatchconfig.js', configContent);
                                console.clear();
                                console.log('Les données de configuration ont été mises à jour.');

                                rl.prompt();

                            });
                        });
                    });
                });
            });
        }

        function editJson() {

            console.clear();
            console.log(logger.message.green);
            rl.question('Avez-vous le tableau json quand vous allez sur lurl api.js ? (y/n) : ', (answer) => {
                if (answer === "y") {
                    console.clear();

                    rl.question('Entrez lurl du fichier json : ', (url) => {
                        console.clear();
                        urlJsonFile = url;
                        jsonapi = true;

                        console.log("Fin de l'édition du fichier json.mwapi");
                        rl.prompt();
                    });

                } else if (answer === "n") {
                    console.clear();
                    jsonapi = false;

                    console.log("Fin de l'édition du fichier json.mwapi");
                    rl.prompt();
                }
            });
        }

        rl.prompt();

        rl.on('line', async (input) => {
            const args = input.trim().split(' ');

            switch (args[0]) {
                case 'help':
                    help();
                    break;

                case 'assist':
                    console.log(prefix + 'Assistance :');
                    console.log("L'assistance n'est pas encore disponible.\n");
                    break;

                case 'service':
                    if (args.length < 2) {
                        console.log("Commande 'service' nécessite un sous-argument.\n");
                        break;
                    }
                    switch (args[1]) {
                        case 'api':
                            if (args.length < 3) {
                                console.log("Commande 'service api' nécessite un sous-argument.\n");
                                break;
                            }
                            switch (args[2]) {
                                case 'start':
                                    console.log(prefix + 'Démarrage du service API...');
                                    console.log(prefix + 'Connexion à la base de données...\n');
                                    await establishConnection();
                                    break;

                                case 'stop':
                                    console.log(prefix + 'Arrêt du service API...');
                                    console.log(prefix + 'Fermeture de la connexion à la base de données...\n');
                                    await closeConnection();
                                    break;

                                default:
                                    console.log("Sous-commande 'start' ou 'stop' attendue pour 'service api'.\n");
                                    break;
                            }
                            break;

                        case 'editor':
                            if (args.length < 3) {
                                console.log("Commande 'service api' nécessite un sous-argument.\n");
                                break;
                            }
                            switch (args[2]) {
                                case 'config':
                                    console.log(prefix + 'Ouverture de l\'éditeur de configuration...');
                                    editConfig();
                                    break;

                                case 'json':
                                    console.log(prefix + 'Ouverture de l\'éditeur de json...');
                                    editJson();
                                    break;

                                default:
                                    console.log("Sous-commande 'config attendue pour 'service editor'.\n");
                                    break;
                            }
                            break;

                        default:
                            console.log("Sous-commande 'api' ou 'editor' attendue pour 'service'.\n");
                            break;
                    }
                    break;

                case 'debug':
                    console.log(prefix + 'Données de débogage :');
                    console.log("Les données de débogage ne sont pas encore disponibles.\n");
                    break;

                case 'updater':
                    checkAndUpdate();
                    break;

                case 'clear':
                    console.clear();
                    break;

                case 'exit':
                    console.log(prefix + 'Fermeture de l\'application...\n');
                    setTimeout( () => {
                        rl.close();
                    }, 3000);
                    break;

                default:
                    console.log(errormsg);
                    break;
            }

            rl.prompt();
        });

        rl.on('close', () => {
            // Fermer la connexion à la base de données avant de quitter l'application
            dbConnection.end((err) => {
                if (err) {
                    console.log('Erreur lors de la fermeture de la connexion à la base de données :', err.message);
                } else {
                    console.log('Connexion à la base de données fermée.');
                }
                console.log('\nAu revoir !\n');
                console.clear();
                process.exit(0);
            });
        });
    }

    module.exports = createCLI;
}
