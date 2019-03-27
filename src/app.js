const env = require('dotenv').config();
const express = require('express');
const validator = require('express-validator');
const routes = require('./routes/RoutesDispatcher');
const logger = require('./utils/Logger');
const appInfo = require('./utils/AppInfo');

if (env.error) {
    logger.error(`error parsing .env file ${env.error}`);    
    return;
} else {
    logger.info(`.env file loaded`);
}

const app = express();
app.use(express.json());
app.use(routes);

logger.info(`starting microservice`);
const server = app.listen(appInfo.port, '0.0.0.0', () => {
    const port = server.address().port;
    logger.info(`listening on port: ${port}`);2
});
