/* jslint node es6 */

const logger = require('../../utils/Logger');
const appInfo = require('../../utils/AppInfo');

module.exports = function middlewareLogger(req, res, next) {
	const originIp = req.ip || req.headers['x-real-ip'] || req.connection.remoteAddress;
	logger.debug(`[${appInfo.appName}][${appInfo.appVersion}][request] #[${originIp}]# [${req.method}] - [${req.path}] - [${JSON.stringify(req.body, null, 2)}]`);
	res.on('finish', () => {
		logger.debug(`[${appInfo.appName}][${appInfo.appVersion}][response] #[${originIp}]# [${req.method}] - [${res.statusCode}] - [${req.path}]`);
	});
	next();
};
