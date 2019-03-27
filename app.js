const express = require('express');
const validator = require('express-validator');
const routes = require('./routes/RoutesDispatcher');
const logger = require('./utils/Logger');
const appInfo = require('./utils/AppInfo');

const app = express();
app.use(express.json());
app.use(routes);

logger.info(`[${appInfo.appName}][${appInfo.appVersion}] - starting microservice`);
const server = app.listen(appInfo.port, '0.0.0.0', () => {
    const port = server.address().port;
    logger.info(`[${appInfo.appName}][${appInfo.appVersion}] - listening on port: ${port}`);2
});
