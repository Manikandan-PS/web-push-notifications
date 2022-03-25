const winston = require('winston');
const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, 'logs');
console.log(logDir)
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const debug = winston.createLogger({
    level: 'info',
    transports: [
        new(winston.transports.Console)({
            colorize: true
        }),
        new winston.transports.DailyRotateFile({
            filename: process.env.LOG_FILENAME,
            dirname: path.join(__dirname, 'logs'),
            mazsize: 1024 * 1024 * 50, //50 MB - Maximum size of the file after which it will rotate
            maxFiles: 31, //Maximum number of logs to keep, Since we keep a log per day, we will have last 30 days logs if max file size doesn't exceed.
            datePattern: 'DD-MMM-YYYY' //Moment.js data-format.
        })
    ]
});
