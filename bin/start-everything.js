const argv = require("yargs").argv;
let pathToConf = (argv.conf || "./conf/conf.js");
pathToConf = `--conf=${pathToConf}`;
console.log("start-everything, pathToConf: %s", pathToConf);
const startDetached = require("../scripts/start-detached");

startDetached("node", ["./bin/start-ps.js", pathToConf], "medi-rest")
