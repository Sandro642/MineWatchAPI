require('colors');

const readline = require('readline');
const mysql = require('mysql');
const config = require('../config/config');
const { connectToDatabase } = require('../api/api');


const prefix = '\n[MineWatchAPI] '.blue;
const errormsg = prefix + 'Commande inconnue. Tapez "help" pour obtenir de l\'aide.\n';

function createCLI() {
    const dbConnection = mysql.createConnection(config);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: 'console'.blue + '@'.white + 'MineWatchAPI-$'.green + ' ' // Personnalisez le prompt ici
    });

    function showHelp() {
        console.log("\nCommandes disponibles : \n" +
            "                       \n" +
            "help : Affichez l'aide\n" +
            "exit : Quittez l'application\n" +
            "api : Sous arguments [start, stop]\n")

        rl.prompt(); // Affichez à nouveau le prompt après avoir affiché l'aide
    }

    rl.prompt();

    rl.on('line', async (input) => {
        const args = input.trim().split(' ');

        if (args[0] === 'help') {
            showHelp();
        } else if (args[0] === 'exit') {
            rl.close();
        } else if (args[0] === 'clear') {
            console.clear();
        } else if (args[0] === 'api') {
            // Check for sub-arguments
            if (args[1] === 'start') {
                console.clear();
                console.log(prefix + 'Starting API...\n'.green)
                await connectToDatabase();
            } else if (args[1] === 'stop') {
                console.clear();
                console.log(prefix + 'Stopping API...\n'.red)

            } else {
                console.log(errormsg);
            }
        } else {
            console.log(errormsg);
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
