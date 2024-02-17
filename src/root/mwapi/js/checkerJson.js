// checkerJson.js
const path = require('path');
const fs = require('fs');

const JsonFilePath = path.join('src', 'root', 'mwapi', 'file', 'json.mwapi');
const JsonInfoContent = fs.readFileSync(JsonFilePath, 'utf-8');

let jsonapi;


fs.readFile(JsonFilePath, 'utf8', (err, content) => {
    if (err) {
        console.error(err);
        return;
    }
/** 
    try {
        // Convertir le contenu en tant qu'objet JSON
        const data = JSON.parse(content);

        // Modifier la valeur de la clé "json"
        data.jsonapi = jsonapi;

        // Convertir l'objet modifié en JSON
        const modifiedContent = JSON.stringify(data, null, 4);

        // Réécrire le contenu modifié dans le fichier
        fs.writeFile(JsonFilePath, modifiedContent, 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('Fichier mis à jour avec succès.');
        });
    } catch (jsonError) {
        console.error('Erreur lors de l\'analyse JSON:', jsonError);
    }
    **/
});

// Extraire la version à partir du contenu
const match = JsonInfoContent.match(/jsonapi: (.+)/);
const jsontype = match ? match[1] : null;

module.exports = {
    jsontype,
    jsonapi,
}