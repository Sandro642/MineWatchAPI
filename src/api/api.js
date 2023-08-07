// api.js

require('colors');

const http = require('http');
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const config = require('../config/config');
const logger = require('../misc/logger');

const app = express();
const port = config.port; // Remplacez par le port sur lequel vous souhaitez que l'API s'exécute

// Autoriser toutes les origines
app.use(cors());

// Configuration de la base de données
const dbConnection = mysql.createConnection(config);

// Vérifier la connexion à la base de données
dbConnection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err.message);
        return;
    }

    console.clear();
    console.log(logger.message.green);
    console.log('')

    // Récupérer les données de la table_joueurs avec le temps de l'action
    const sql = 'SELECT *, DATE_FORMAT(Timestamp, "%Y-%m-%d %H:%i:%s") as Timestamp FROM table_joueurs';
    dbConnection.query(sql, (err, result) => {
        if (err) {
            console.error('Erreur lors de la récupération des données :', err.message);
            return;
        }

        if (!result.length > 0) {
            console.log('Aucune donnée trouvée.');
        }

        // Fermer la connexion à la base de données
        dbConnection.end();
    });
});

// Démarrer le serveur
const server = http.createServer(app);
server.listen(port, () => {
    console.log(`Serveur en cours d'écoute sur le port ${port}`);
});
