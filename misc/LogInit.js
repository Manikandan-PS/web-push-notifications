"use strict";

const fs = require("fs");
const zlib = require("zlib");

function packFile(fileName) {
	return new Promise((resolve) => {
		console.log("packing file %s", fileName);
		const gzip = zlib.createGzip();
		const inp = fs.createReadStream(`${fileName}`);
		const out = fs.createWriteStream(`${fileName}.gz`);
		inp.on("error", (err) => {
			console.error("packing error:", err);
		});
		out.on("error", (err) => {
			console.error("packing error:", err);
		});
		out.once("finish", () => {
			console.log("finish event received");
			inp.removeAllListeners();
			out.removeAllListeners();
			inp.destroy();
			gzip.end();
			out.destroy();
			resolve();
		});
		inp.pipe(gzip).pipe(out);
	});
}

function deleteFile(fileName) {
	return new Promise((resolve) => {
		console.log("deleting file %s", fileName);
		fs.unlink(fileName, (err) => {
			resolve(err);
		});
	});
}


var Logger = function (logName, conf) {
	if (conf.enabledLogs) {
		process.env.DEBUG = conf.enabledLogs;
	}
	let currentFileName;
	console.log("process.env.debug: %s", process.env.DEBUG);
	logName = logName || "log";
	const settings = conf.settings;
	const folder = settings.saveFolder || process.env.LI_LOGS_FOLDER || "./savedData";
	console.log("log-init, logName: %s", logName);
	if (settings.logToFile) {
		try {
			fs.accessSync(folder);
		} catch (err) {
			fs.mkdirSync(folder);
		}
		const savePath = folder + "/logs";
		try {
			fs.accessSync(savePath);
		} catch (err) {
			fs.mkdirSync(savePath);
		}
		var weekDay = null;

		var errLog = null;
		var outLog = null;

		function write(type, str) {
			var dateStr = Date();
			var split = dateStr.split(" ");
			if (split[0] !== weekDay) {
				weekDay = split[0];
				const p = new Promise((resolve) => {
					let n = 0;
					if (errLog) {
						errLog.end(() => {
							n++;
							if (n === 2) {
								resolve();
							}
						});
					}
					if (outLog) {
						outLog.end(() => {
							n++;
							if (n === 2) {
								resolve();
							}
						});
					}
				});

				// pack old logs, if this feature is on in settings
				if (settings.gzipLogs && currentFileName) {
					const oldFileNames = [`${currentFileName}.out`, `${currentFileName}.err`];
					p.then(async () => {
						await Promise.all(oldFileNames.map(fileName => packFile(fileName)));
						await Promise.all(oldFileNames.map(fileName => deleteFile(fileName)));
					});
				}
				currentFileName = `${savePath}/log-${logName}_${split[1]}-${split[2]}-${split[3]}`;
				errLog = fs.createWriteStream(currentFileName + ".err", { flags: "a" });
				outLog = fs.createWriteStream(currentFileName + ".out", { flags: "a" });
			}

			if (settings.stripColorCodes)
				str = stripcolorcodes(str);

			if (settings.addDate)
				str = dateStr + ": " + str;

			if (type === "e")
				errLog.write(str);
			else
				outLog.write(str);
		}
		console.log("log-init, %s replacing stdout.write", logName);
		process.stdout.write = write.bind(null, "o");
		process.stderr.write = write.bind(null, "e");
	}
}

module.exports = Logger;