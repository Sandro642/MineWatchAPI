// checkerCLI.js
const path = require('path');
const fs = require('fs');

const CliFilePath = path.join('../mwapi/file/cli.mwapi');
const CliInfoContent = fs.readFileSync(CliFilePath, 'utf-8');

// Extraire la version à partir du contenu
const match = CliInfoContent.match(/pageapi: (.+)/);
const clitype = match ? match[1] : null;

module.exports = clitype;