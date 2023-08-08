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
app.get('/api', async (req, res) => {
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

// Écoute du serveur sur le port 8080 (HTTP)
server.listen(8080, () => {
    console.log('Serveur HTTP en écoute sur le port 8080');
});

// Fonction pour récupérer et afficher les données depuis l'API
async function fetchAndDisplayData() {
    try {
        const response = await fetch('/api'); // Assurez-vous que le chemin est correct
        const data = await response.json();

        const tableBody = document.querySelector('#jsonTable tbody');
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.player}</td>
                <td>${item.action}</td>
                <td>${item.world}</td>
                <td>${item.heure}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
    }
}

// Appeler la fonction pour récupérer et afficher les données
fetchAndDisplayData();

module.exports = { DatabaseConnector };
