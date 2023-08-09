const http = require('http');
const mysql = require('mysql');
const config = require('../config/config');

// Autoriser toutes les origines (à utiliser uniquement pour le développement)
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

// Configuration de la base de données
const dbConfig = {
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
};

let conn; // Déclaration de la variable de connexion en dehors du scope des fonctions

// Fonction pour établir la connexion à la base de données
function establishConnection() {
    conn = mysql.createConnection(dbConfig);
    conn.connect((err) => {
        if (err) {
            console.error('Erreur de connexion à la base de données :', err);
            return;
        }
        console.log('Connecté à la base de données.\n');

        // Vérifier et créer la table si elle n'existe pas
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS table_joueurs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                World VARCHAR(255),
                Player VARCHAR(255),
                Action VARCHAR(255),
                Timestamp DATETIME
            );
        `;

        conn.query(createTableQuery, (createErr, createResult) => {
            if (createErr) {
                console.error('Erreur lors de la création de la table :', createErr);
            } else {
                console.log('Table créée ou vérifiée avec succès.\n');
            }
        });
    });
}

// Fonction pour fermer la connexion à la base de données
function closeConnection() {
    if (conn) {
        conn.end(err => {
            if (err) {
                console.error('Erreur lors de la fermeture de la connexion :', err + '\n');
            } else {
                console.log('Connexion à la base de données fermée.\n');
            }
        });
    }
}

// Créer le serveur HTTP
const server = http.createServer((req, res) => {
    res.writeHead(200, headers);

    // Vérifier si la connexion est établie avant d'exécuter la requête
    if (!conn) {
        res.end(JSON.stringify({ message: 'La connexion à la base de données n\'est pas établie.\n' }));
        return;
    }

    // Récupérer les données de la table_joueurs avec le temps de l'action
    const sql = 'SELECT *, DATE_FORMAT(Timestamp, "%Y-%m-%d %H:%i:%s") as Timestamp FROM table_joueurs';

    conn.query(sql, (err, result) => {
        if (err) {
            console.error('Erreur lors de la requête SQL :', err);
            res.end(JSON.stringify({ message: 'Erreur lors de la récupération des données.\n' }));
            return;
        }

        if (result.length > 0) {
            // Renvoyer les données au format JSON
            res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        } else {
            res.end(JSON.stringify({ message: 'Aucune donnée trouvée.\n' }));
        }
    });
});

module.exports = {
    establishConnection,
    closeConnection,
    server,
};