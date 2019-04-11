/* jslint node es6 */

const express = require('express');
const auth = require('./AuthRoutes');
const appInfo = require('../utils/AppInfo');

module.exports = function(lib) {
	const router = express.Router();
	router.use(lib.loggingRequestMiddleware)
	router.get('/', (req, res) => {
		res.send('working');
	});
	router.use('/auth/', auth);
	return router
};
