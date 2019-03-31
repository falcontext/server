/* jslint node es6 */



module.exports = function (appInfo) {
	const logger = require('../logger/Logger')(appInfo);
	return function middlewareLogger(req, res, next) {
		const originIp = (req.headers['x-forwarded-for'] || '').split(',').pop() 
						|| req.headers['x-real-ip'] 
						|| req.connection.remoteAddress
		logger.debug(`[${appInfo.appName}][${appInfo.appVersion}][request] #[${originIp}]# [${req.method}] - [${req.path}] - [${JSON.stringify(req.body, null, 2)}]`);
		res.on('finish', () => {
			logger.debug(`[${appInfo.appName}][${appInfo.appVersion}][response] #[${originIp}]# [${req.method}] - [${res.statusCode}] - [${req.path}]`);
		});
		next();
	};
};
