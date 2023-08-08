require('colors');

const dbConfig = require("../config/config");
const logger = require('../misc/logger');
const createCLI = require('../misc/cli');
const express = require("express");

const app = express();

const port = 3000; // Vous pouvez changer le port si nécessaire
app.listen(port, () => {
    main();
});


  function main() {
        console.clear();
        console.log(logger.message.green);
        createCLI();
    }