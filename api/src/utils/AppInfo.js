const packageJSON = require('../../package.json');

module.exports = {
	appName: packageJSON.name,
	appVersion: packageJSON.version,
	port: 8080
};
