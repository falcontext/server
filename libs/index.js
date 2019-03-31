const env = require('dotenv').config();

class Libs { 
    constructor ( config ) {
        this.appInfo = config.appInfo
        this.logger = require('./logger/Logger')(this.appInfo);
        this.loggingRequestMiddleware = require('./middleware/LoggingRequestMiddleware')(this.appInfo);
    }
}

module.exports = ( config ) => { return new Libs(config) }