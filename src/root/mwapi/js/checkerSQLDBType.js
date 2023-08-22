// checkerSQLDBType.js
const path = require('path');
const fs = require('fs');

const sqlFilePath = path.join('../mwapi/file/sqldb.mwapi');
const SQLDBInfoContent = fs.readFileSync(sqlFilePath, 'utf-8');

// Extraire la version à partir du contenu
const match = SQLDBInfoContent.match(/DBType: (.+)/);
const sqldbtype = match ? match[1] : null;

module.exports = sqldbtype;
