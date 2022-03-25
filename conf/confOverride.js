"use strict";

module.exports = {
    dbconfig: {
        hostname: "localhost",
        username: "",
        password: "",
        database: "",
        port: 27017
    },
    // enabledLogs: "*:error,*:important,*function,*trace",
    enabledLogs: "*",
    encryption: {
        requestDecryption: false,
        responseEncryption: false,
        algorithm: "aes-128-cbc",
        encryptionKey: `xjmlcuFNUHXFJv3dQ+Ts9g==`,
        decryptionKey: `xjmlcuFNUHXFJv3dQ+Ts9g==`
    },
    useSsl: false,
    sslconf: {
        keyfile: "/root.key",
        certfile: "/root.crt",
        cafile: "/root.crt"
    },
    timezone: "+05:30",
    server: {
        port: 7000,
        host: 'localhost'
    },
    settings: {
        saveFolder: "",
        // size of db connection pool, 30 is a good default
        connectionPoolSize: 30,
        //logToFile: set this to false to log DEBUG output to console, true to log it to a file in ./savedData/logs
        logToFile: true,
    }
}



