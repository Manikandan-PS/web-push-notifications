const express = require('express');
const fs = require("fs");
const conf = require("./conf/conf");
const http = require('http');
const cors = require('cors');
const webPush = require('web-push');

// import connectToDB from './databaseConnector/dbconnection';

const app = express();
// const debug = require('./debug/Debug');

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
    res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    next();
});

app.use(express.static(__dirname + "/ui/"));
app.use((req, res, next) => {
    // debug.info("req:", req.body);
    next();
})

var vapidPublicKey = "BFuvdVnXTI6-sA7VR6waS08FaHrxGB9CQOKbnIyinbWLljxciHfHn1V9D7WiJ1K9mKN1bRi5_PBMFWJu2TfxVeE";
var vapidPrivateKey = "r4pRV9zcBh49O-eAwTtrP_WZ6U0xs1NgNhj-cDpiRfs";
var tokenlist = [];

webPush.setVapidDetails(
  'mailto:manikandan.m@purpleslate.com',
  vapidPublicKey,
  vapidPrivateKey
);

app.post('/subscribe',(req,res)=>{
    var token = req.body.token;
    var auth = req.body.auth;
    var endpoint = req.body.endpoint;
    var subscription = {token:token,auth:auth,endpoint:endpoint}
    tokenlist.push(subscription);
    // db.updateUserSubscription(subscription);
    console.log("adding token: "+ token + " with auth: " + auth + " and notification url:" + endpoint);
    res.end("ok");
});
app.get('/notify',sendNotification);

let secure = false;
if (conf.useSsl || process.argv.indexOf("secure") > -1) {
    secure = true;
}
if (secure) {
    try {
        // debug.info("secure server, starting");
        conf.sslconf.key = fs.readFileSync(conf.sslconf.keyfile);
        conf.sslconf.cert = fs.readFileSync(conf.sslconf.certfile);
        conf.sslconf.ca = [fs.readFileSync(conf.sslconf.cafile)];
        var server = require('https').createServer(conf.sslconf, app);
    } catch (err) {
        console.log("Error starting ssl server: ", err);
    }
} else {
    var server = http.createServer(app);
}

var port = conf.server.port || 7000;
var port = 7000;
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// connectToDB();

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {

        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;

        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;

        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    console.log('Listening on ' + bind);
}


function sendNotification(req,res){
    var options = {
        TTL: 24 * 60 * 60,
        vapidDetails: {
          subject: 'mailto:mnikandan.m@purpleslate.com',
          publicKey: vapidPublicKey,
          privateKey: vapidPrivateKey
        }
    };
    var message = "Web Notification from PS";
        
    for (var i=0;i < tokenlist.length;i++) {
        let pushSubscription = {
         "endpoint":tokenlist[i].endpoint,
         "keys": {
             "p256dh":tokenlist[i].token,
             "auth": tokenlist[i].auth
             }
        }; 
        webPush.sendNotification(pushSubscription,message,options);
    }
    console.log(tokenlist.length + " notification sent");
    res.end( tokenlist.length + " notification sent");
}


module.exports = server;