
const { createLogger, format, transports } = require('winston');
const path = require('path');
const appInfo = require('./AppInfo');

const logDir = process.env.LOG_DIR;
const filename = path.join(logDir, `${appInfo.appName}_.log`);


module.exports = createLogger({
	level: 'debug',
	format: format.combine(
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		format.printf(
			info => `${info.timestamp} - [${appInfo.appName}][${appInfo.appVersion}][${info.level}]: - ${info.message}`,
		),
	),
	transports: [
		new transports.Console({
			level: process.env.LOG_LEVEL,
			format: format.combine(
				format.colorize(),
			),
		}),
		new transports.File({
			filename,
			maxsize: 250 * 1024,
		}),
	],
});
