const http = require('http');
const url = require('url');
const mysql = require('mysql');

// Autoriser toutes les origines (à utiliser uniquement pour le développement)
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type'
};

// Configuration de la base de données
const dbConfig = {
    host: 'mysql-hungrycodes.alwaysdata.net',
    user: '307217_sandro',
    password: 'Sandro3345',
    database: 'hungrycodes_minewatch'
};

// Créer une connexion à la base de données
const connection = mysql.createConnection(dbConfig);

// Établir la connexion à la base de données
connection.connect(function(err) {
    if (err) {
        console.log('Erreur de connexion à la base de données :', err);
        return;
    }
    console.log('Connecté à la base de données.');
});

// Créer un serveur HTTP
const server = http.createServer(function(req, res) {
    // Activer les en-têtes CORS
    res.writeHead(200, headers);

    // Récupérer les données de la table_joueurs avec le temps de l'action
    const sql = 'SELECT *, DATE_FORMAT(Timestamp, "%Y-%m-%d %H:%i:%s") as Timestamp FROM table_joueurs';
    connection.query(sql, function(err, result) {
        if (err) {
            console.log('Erreur lors de la requête SQL :', err);
            res.end('Une erreur s\'est produite.');
            return;
        }

        if (result.length > 0) {
            // Renvoyer les données au format JSON
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
        } else {
            res.end('Aucune donnée trouvée.');
        }
    });
});

module.exports = connection;