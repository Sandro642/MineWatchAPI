require('colors');

const logger = require('../misc/logger');
const version = require('../version/checkerVersion');

if (version === "latest") {
    const { server } = require("../../latest/api/api")
    server.listen(8080, () => {
        main();
    });
} else if (version === "dev") {

    const { server } = require("../../dev/api/api");
    server.listen(8080, () => {
        main();
    });
}

  function main() {
    if (version === "latest") {
        const createCLI = require("../../latest/misc/cli");
        console.clear();
        console.log(logger.message.green);
        console.log("BUILD: LATEST detected.".green);
        createCLI();
    } else if (version === "dev") {
        const createCLI = require("../../dev/misc/cli");
        console.clear();
        console.log(logger.message.green);
        console.log("BUILD: DEV detected.".green);
        createCLI();
    }
  }