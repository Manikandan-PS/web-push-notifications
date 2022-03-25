//first tries to load confOverride.js
//if it is not present, loads confDefault.js

const fs = require("fs");
const defaultConf = require("./confDefault.js");

function replaceUndefinedByDefaults(objMain, objOver) {
	for (var key in objMain) {
		if (objOver[key] === undefined) {
			objOver[key] = objMain[key];
		} else if (typeof objMain[key] === "object") {
			replaceUndefinedByDefaults(objMain[key], objOver[key]);
		}
	}	
}

try {
	fs.accessSync("./conf/confOverride.js");
	//if accessSync does not throw, then it exists, require config override file as config file
	var conf = require("./confOverride.js");
	replaceUndefinedByDefaults(defaultConf, conf);
	console.log("= OVERRIDING CONFIG WITH conf/confOverride.js =");
} catch(err) {
	console.log("! NO CONFIG OVERRIDE !");
	//no confOverride.js, using default config
	conf = defaultConf;
}

module.exports = conf;
