const express = require('express');
const http = require('http');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/config');

const app = express();

// Classe JavaScript pour gérer la connexion à la base de données
class DatabaseConnector {
    static async connect() {
        try {
            const pool = mysql.createPool(dbConfig);
            const connection = await pool.getConnection();
            console.log('Connexion à la base de données réussie.\n');
            return connection;
        } catch (error) {
            console.error('\nErreur lors de la connexion à la base de données:', error + '\n');
            return null;
        }
    }

    static async disconnect(connection) {
        try {
            await connection.release();
            console.log('\nDéconnexion de la base de données réussie.\n');
        } catch (error) {
            console.error('\nErreur lors de la déconnexion de la base de données:', error + '\n');
        }
    }
}

// Route pour récupérer les données de la base de données
app.get('api.js', async (req, res) => {
    const connection = await DatabaseConnector.connect();

    if (!connection) {
        res.status(500).json({ error: 'Erreur lors de la connexion à la base de données' });
        return;
    }

    try {
        const [rows] = await connection.query('SELECT * FROM table_joueurs');
        res.setHeader('Content-Type', 'application/json');
        res.json(rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    } finally {
        await DatabaseConnector.disconnect(connection);
    }
});

// Création du serveur HTTP
const server = http.createServer(app);

// Écoute du serveur sur le port 80 (HTTP)
server.listen(80, () => {
    console.log('Serveur HTTP en écoute sur le port 80');
});

module.exports = { DatabaseConnector, app };