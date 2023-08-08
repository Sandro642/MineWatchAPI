require('colors');

const logger = require('../misc/logger');
const createCLI = require('../misc/cli');
const express = require("express");

const app = express();

app.listen(3000, () => {
    main();
});


  function main() {
        console.clear();
        console.log(logger.message.green);
        createCLI();
    }