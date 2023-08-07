// Autoriser toutes les origines (à utiliser uniquement pour le développement)
// Dans JavaScript, l'accès aux ressources d'autres domaines doit être géré côté serveur,
// donc la configuration CORS doit être définie dans la configuration du serveur HTTP.
// Cela ne peut pas être géré directement dans le code JavaScript.
// Vous devrez configurer votre serveur pour autoriser les requêtes AJAX provenant d'autres domaines.

// Configuration de la base de données (les identifiants de connexion ne devraient pas être exposés côté client en JavaScript, mais plutôt côté serveur)

import config from './connexion.js';

const servername = config.username;
const username = config.host;
const password = config.password;
const dbname = config.dbname;

// Fonction pour effectuer une requête AJAX pour récupérer les données
function fetchData() {
    // Créer une instance de l'objet XMLHttpRequest
    const xhr = new XMLHttpRequest();

    // Configurer la requête
    const url = 'https://exemple.com/fetchdata'; // Remplacez "https://exemple.com/fetchdata" par l'URL de votre serveur et le chemin de l'API qui renvoie les données
    xhr.open('GET', url, true);

    // Gérer la réponse de la requête
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            // La requête s'est bien déroulée, convertir les données JSON en objet JavaScript
            const data = JSON.parse(xhr.responseText);

            // Faire ce que vous voulez avec les données, par exemple, afficher les résultats dans la console
            console.log(data);
            console.log("MineWatchAPI est connecté à la base de données !");
        } else {
            // La requête a échoué
            console.error('Erreur lors de la récupération des données.');
        }
    };

    // Gérer les erreurs de connexion
    xhr.onerror = function () {
        console.error('Erreur de connexion au serveur.');
    };

    // Envoyer la requête
    xhr.send();
}

// Appeler la fonction pour récupérer les données
fetchData();
