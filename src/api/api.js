const http= require('http');
const mysql = require('mysql');

// Autoriser toutes les origines (à utiliser uniquement pour le développement)
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};

// Configuration de la base de données
const dbConfig = {
    host: 'mysql-hungrycodes.alwaysdata.net',
    user: '307217_sandro',
    password: 'Sandro3345',
    database: 'hungrycodes_minewatch',
};

// Créer une connexion à la base de données
const conn = mysql.createConnection(dbConfig);

// Se connecter à la base de données
conn.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
        return;
    }

    console.log('Connecté à la base de données.');
});

// Créer le serveur HTTP
const server = http.createServer((req, res) => {
    res.writeHead(200, headers);

    // Récupérer les données de la table_joueurs avec le temps de l'action
    const sql = 'SELECT *, DATE_FORMAT(Timestamp, "%Y-%m-%d %H:%i:%s") as Timestamp FROM table_joueurs';
    conn.query(sql, (err, result) => {
        if (err) {
            console.error('Erreur lors de la requête SQL :', err);
            res.end(JSON.stringify({ message: 'Erreur lors de la récupération des données.' }));
            return;
        }

        if (result.length > 0) {
            // Renvoyer les données au format JSON
            res.writeHead(200, { ...headers, 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
            console.log(result)
        } else {
            res.end(JSON.stringify({ message: 'Aucune donnée trouvée.' }));
        }
    });
});

// Démarrer le serveur sur le port 3000
const port = 3000;
server.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
