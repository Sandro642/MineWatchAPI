const express = require('express');
const mysql = require('mysql2/promise'); // Utilisez la version promise de mysql2 pour les requêtes asynchrones
const dbConfig = require('../config/config'); // Importer les informations de configuration depuis le fichier config.js

const app = express();

// Var
let rows = {};

// Classe JavaScript pour gérer la connexion à la base de données
class DatabaseConnector {
    // Méthode statique pour se connecter à la base de données
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

    // Méthode statique pour fermer la connexion à la base de données
    static async disconnect(connection) {
        try {
            await connection.release();
            console.log('\nDéconnexion de la base de données réussie.\n');
        } catch (error) {
            console.error('\nErreur lors de la déconnexion de la base de données:', error + '\n');
        }
    }
}

// Définir une route pour récupérer les données de la base de données
app.get('/api/data', async (req, res) => {
    const connection = await DatabaseConnector.connect();

    if (!connection) {
        res.status(500).json({ error: '\nErreur lors de la connexion à la base de données\n' });
        return;
    }

    try {
        // Récupérer les données de la table_joueurs
        const [rows] = await connection.query('SELECT * FROM table_joueurs');
        res.json(rows);
    } catch (error) {
        console.error('\nErreur lors de la récupération des données:', error + '\n');
        res.status(500).json({ error: '\nErreur lors de la récupération des données\n' });
    } finally {
        // Fermer la connexion à la base de données après avoir récupéré les données
        await DatabaseConnector.disconnect(connection);
    }
});

module.exports = {
    DatabaseConnector
}

