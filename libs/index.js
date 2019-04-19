const env = require('dotenv').config();

class Libs { 
    constructor ( config ) {
        this.appInfo = config.appInfo
        this.logger = require('./logger/Logger')(this.appInfo);
        this.loggingRequestMiddleware = require('./middleware/LoggingRequestMiddleware')(this.appInfo);
        this.authorizeRequestMiddleware = require('./middleware/AuthorizeRequestMiddleware');
        this.jwtUtils = require('./utils/JWTUtils');
    }
}

module.exports = ( config ) => { return new Libs(config) }