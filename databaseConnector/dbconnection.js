import Mongoose from "mongoose";
import logger from "../debug/Debug";

Mongoose.Promise = global.Promise;
const connectToMongoDb = async() => {
    try {
        let uri = 'mongodb://' + this.conf.dbconfig.hostname + ':' + this.conf.dbconfig.port;
        await Mongoose.connect(uri, {
            poolSize: 30,
            dbName: this.conf.dbconfig.database,
            user: this.conf.dbconfig.userName,
            pass: encodeURIComponent(this.conf.dbconfig.password)
        });
        console.log(host)
        Mongoose.set('debug', { shell: true })
        logger.info(`MongoDB Connected to ${this.conf.dbconfig.database}`);

    } catch (error) {
        console.log(error)
        logger.error(`Error Connecting to MongoDB  ${database_name}`);
    }

};

export default connectToMongoDb;