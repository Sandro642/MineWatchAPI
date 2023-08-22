// check version
const path = require('path');
const fs = require('fs');

const versionFilePath = path.join('../mwapi/file/version.mwapi');
const versionInfoContent = fs.readFileSync(versionFilePath, 'utf-8');

// Extraire la version à partir du contenu
const match = versionInfoContent.match(/version: (.+)/);
const version = match ? match[1] : null;

module.exports = version;