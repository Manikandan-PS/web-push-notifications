
const child_process = require("child_process");
const fs = require("fs");
const util = require("util");
const path = require("path");

const open = util.promisify(fs.open);

/**
 * Starts a detached long-running process with a stdin and stdout piped to file
 * which will run even after parent process exits
 * @param {string} cmd command used to start
 * @param {string[]} [args] command arguments
 * @param {string} [name] optionally, process name which will be used for stdin and stdout
 * output files
 */
module.exports = async function(cmd, args, name) {
    try {
        name = name || "cmd";
        try {
            fs.mkdirSync("savedData");
        } catch(err) {
            console.log("+");
        }
        
        const [ out, err ] = await Promise.all([
            open(`./savedData/${name}.out`, 'a'),
            open(`./savedData/${name}.err`, 'a')
        ]);
        let fileNameIndex = 0;
        while (args[fileNameIndex].startsWith("-")) {
            fileNameIndex++;
        }
        args[fileNameIndex] = path.join(__filename, "../..", args[fileNameIndex]);
        const subprocess = child_process.spawn(cmd, args, {
            detached: true,
            stdio: [ 'ignore', out, err ]
        });
        subprocess.unref();
    } catch(err) {
        console.error("error starting %s: %s", cmd, err.stack);
    }
}