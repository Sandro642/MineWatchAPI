require('colors');

const logger = require('../misc/logger');
const version = require('../version/checkerVersion');
const { server } = require("../../app/api/api")
const createCLI = require("../../app/misc/cli");

if (version === "latest") {

    server.listen(8080, () => {
        main();
    });
} else if (version === "dev") {
    server.listen(8080, () => {
        main();
    });
}

  function main() {
    if (version === "latest") {
        console.clear();
        console.log(logger.message.green);
        console.log("BUILD: LATEST detected.".green + "\n");
        createCLI();
    } else if (version === "dev") {
        console.clear();
        console.log(logger.message.green);
        console.log("BUILD: DEV detected.".green + "\n");
        createCLI();
    }
  }