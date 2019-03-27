
const { createLogger, format, transports } = require('winston');
const path = require('path');
const appInfo = require('./AppInfo');

const logDir = '../data/log/App';
const filename = path.join(logDir, `${appInfo.appName}_.log`);


module.exports = createLogger({
	level: 'debug',
	format: format.combine(
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		format.printf(
			info => `${info.timestamp} ${info.level}: ${info.message}`,
		),
	),
	transports: [
		new transports.Console({
			level: 'debug',
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
