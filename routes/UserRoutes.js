/* jslint node es6 */

const express = require('express');

const validator = require('./middleware/ValidationMiddleware');

const router = express.Router();
router.get('/', (req, res) => {
	res.send("success");
});

router.post('/register', validator.checkValidationResult, (req, res) => {
	userManager.saveUser(req.body).then(() => {
		res.send(req.body);
	}).catch((err) => {
		res.send(err);
	});
});

module.exports = router;
