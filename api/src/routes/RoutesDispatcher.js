/* jslint node es6 */

const express = require('express');
const userRoutes = require('./UserRoutes');
const appInfo = require('../utils/AppInfo');

module.exports = function(lib) {
	const router = express.Router();
	router.use(lib.loggingRequestMiddleware)
	router.get('/', (req, res) => {
		res.send('working');
	});
	router.use('/user/', userRoutes);
	return router
};
