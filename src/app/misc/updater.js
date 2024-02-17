require('colors');

const { exec } = require('child_process');
const path = require('path');
const simpleGit = require('simple-git');

function getLocalCommitHash() {
        const git = simpleGit({ baseDir: this.repoPath });
    
        try {
            const log = git.log();
            if (log && log.latest) {
                return log.latest.hash;
            } else {
                throw new Error("Aucun commit n'a été trouvé dans le dépôt.");
            }
        } catch (error) {
            throw error;
        }
    }
    

function getGithubCommitHash() {
        // Vous devrez utiliser l'API GitHub pour récupérer le dernier hash du commit sur votre référentiel GitHub
        // Ici, vous pouvez utiliser des bibliothèques comme octokit/rest.js pour interagir avec l'API GitHub.
        // Je vais vous montrer un exemple générique.

        // Remplacez "nom_utilisateur" et "nom_repo" par votre nom d'utilisateur GitHub et le nom de votre référentiel.
        const githubRepoUrl = 'https://api.github.com/repos/sandro642/minewatchapi/commits';

        return new Promise((resolve, reject) => {
            // Utilisez fetch ou une bibliothèque similaire pour récupérer les commits depuis GitHub
            fetch(githubRepoUrl)
                .then(response => response.json())
                .then(data => {
                    // Supposons que le premier commit est le dernier commit
                    const latestCommit = data[0];
                    resolve(latestCommit.sha);
                })
                .catch(error => {
                    reject(error);
                });
        });
}

function pullChanges() {
        return new Promise((resolve, reject) => {
            exec('git pull', { cwd: this.repoPath }, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve();
            });
        });
}

function checkAndUpdate() {
    console.log('Recherche de mises à jours...')

    try {

        // Récupérer le dernier hash du commit local
        const localHash = getLocalCommitHash();

        console.log('Dernier commit local :', localHash);

        // Récupérer le dernier hash du commit sur GitHub
        const githubHash = getGithubCommitHash();

        console.log('Dernier commit sur GitHub :', githubHash);

        // Comparer les deux hashes
        if (localHash !== githubHash) {
            // Effectuer un pull si les hashes sont différents
            pullChanges();
            console.log('MineWatchAPI a été mis à jour avec succès !');
            setTimeout(() => {
                 console.log('Redémarrez MineWatchAPI pour appliquer les changements.'.green);
                 setTimeout(() => {
                        console.clear();
                        process.exit(0);
                    }, 3000);
            }, 3000);
        } else {
            console.log('Aucune mise à jour disponible. MineWatchAPI est à jour.');
        }

    } catch (error) {
        console.error('Une erreur est survenue :', error);
    }
}

module.exports = checkAndUpdate;
