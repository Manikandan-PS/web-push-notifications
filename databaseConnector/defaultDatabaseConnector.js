const util = require("util");
const _ = require('lodash')
const mongoose = require('mongoose');

const userSchema = require('./mongoModels/user');
var userModel = mongoose.model('user', userSchema);

class defaultDatabaseConnector {
    constructor(conf) {
        console.info("Mongo DatabaseConnector constructor");
        this.conf = conf;
        this.db = {};
        this.init();
        this.homeObject = {};
        this.popularProducts = {};
    }

    async init() {
        try {
            console.info("function init called");
            let uri = 'mongodb://' + this.conf.dbconfig.hostname + ':' + this.conf.dbconfig.port;
            this.db = await mongoose.connect(uri, {
                poolSize: 30,
                dbName: this.conf.dbconfig.database,
                user: this.conf.dbconfig.userName,
                pass: encodeURIComponent(this.conf.dbconfig.password)
            });
            await this.fetchHomeData();
            this.popularProducts = await this.fetchPopularProducts();
        } catch (err) {
            console.error("error creating db connection", err);
        }
    }
    async onRemove() {
        if (this.db)
            await this.db.close();
    }
}

module.exports = defaultDatabaseConnector;