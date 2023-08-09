require('colors');

const logger = require('../misc/logger');
const createCLI = require('../misc/cli');
const { server } = require("../api/api");

server.listen(8080, () => {
    main();
});


  function main() {
        console.clear();
        console.log(logger.message.green);
        createCLI();
    }