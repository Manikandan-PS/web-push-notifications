const util = require("util");
const conf = require("../conf/conf");
const LogInit = require("../debug/Debug");
LogInit("ps", conf);

const server = require("../index");

process.on("unhandledRejection", (err) => {
    console.error(Date() + ": unhandledRejection:\n%s", util.inspect(err, { showHidden: true, depth: null }));
});

process.on("uncaughtException", (err) => {
    console.error(Date() + ": uncaughtException:\n%s", util.inspect(err, { showHidden: true, depth: null }));
    setTimeout(() => {
        process.exit(1);
    }, 1000);
});



