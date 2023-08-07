require('colors');

const { app } = require('../api/api');
const dbConfig = require("../config/config");
const logger = require('../misc/logger');
const createCLI = require('../misc/cli');

const port = dbConfig.port; // Vous pouvez changer le port si nécessaire
app.listen(port, () => {
    main();
});


  function main() {
        console.clear();
        console.log(logger.message.green);
        createCLI();
    }