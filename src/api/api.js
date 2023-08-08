const http = require('http');
const config = require('../config/config');
const mysql = require('mysql');

// Fonction pour établir la connexion à la base de données
function connectToDatabase() {
    const connection = mysql.createConnection({
        host: config.servername,
        user: config.username,
        password: config.password,
        database: config.dbname
    });

    connection.connect((error) => {
        if (error) {
            console.error('Erreur de connexion à la base de données :', error);
            return;
        }
        console.log('Connexion à la base de données établie.');
    });

    return connection;
}

// Créer le serveur HTTP
const server = http.createServer((req, res) => {
    if (req.url === '/api.js') {
        const dbConnection = connectToDatabase();

        const sql = 'SELECT *, DATE_FORMAT(Timestamp, "%Y-%m-%d %H:%i:%s") as Timestamp FROM table_joueurs';
        dbConnection.query(sql, (error, result) => {
            if (error) {
                console.error('Erreur lors de la requête SQL :', error);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Erreur lors de la récupération des données.');
                return;
            }

            const jsonData = JSON.stringify(result);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(jsonData);

            // Fermer la connexion à la base de données après avoir renvoyé les données
            dbConnection.end();
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page non trouvée.');
    }
});

module.exports = {
    connectToDatabase
}
