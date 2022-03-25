#!/usr/bin/env node

const child_process = require("child_process");

require("yargs")
    .scriptName("ps")
    .usage("$0 <cmd>")
    .command("everything", "Starts up all services on a single server", () => { }, (argv) => {
        require("./start-everything");
        console.log("TO STOP, USE 'ps kill-all', DON'T KILL PROCESSES MANUALLY");
    }).command("start-cluster", "start node services on this cluster mode. Wait for at least 5 seconds before checking running processes with ps", () => { }, (argv) => {
        require("./start-cluster");
        console.log("Allps processes on this server will be started within several seconds.")
    }).command("init [project] [environment]", "creates a config file for a given project and environment", (yargs) => {
        yargs
            .positional("project", {
                describe: "project name, e.g. ps",
                default: "ps"
            })
            .positional("environment", {
                describe: "environment: dev, qa, preprod or prod",
                default: "dev"
            })
    }, (argv) => {
        const fs = require("fs");
        const confFileName = `../conf/conf_${argv.project}_${argv.environment}.js`;
        const defaultConf = require("../conf/confDefault");

        console.log("confFileName: %s", confFileName);
        try {
            function replaceUndefinedByDefaults(objMain, objOver) {
                for (const key in objMain) {
                    if (objOver[key] === undefined) {
                        objOver[key] = objMain[key];
                    } else if (typeof objMain[key] === "object") {
                        replaceUndefinedByDefaults(objMain[key], objOver[key]);
                    }
                }
            }
            const conf = require(confFileName);
            replaceUndefinedByDefaults(defaultConf, conf);
            try {
                fs.mkdirSync("conf");
            } catch (err) {
                console.log("+");
            }
            fs.writeFileSync("./conf/conf.js", `module.exports = ${JSON.stringify(conf, null, 4)}`);
        } catch (err) {
            console.error("No default configuration file for project %s and environment %s, err", argv.project, argv.environment, err);
        }
    })
    .help()
    .argv
