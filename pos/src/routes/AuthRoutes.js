/* jslint node es6 */

const express = require('express');

const validator = require('./middleware/ValidationMiddleware');

const router = express.Router();
router.get('/', (req, res) => {
	res.send("success");
});

router.post('/register', validator.checkValidationResult, (req, res) => {
	res.send('register');
});

router.post('/login', validator.checkValidationResult, (req, res) => {
	res.send('login');
});

router.post('/refresh', (req, res) => {
    res.send('refresh');
});


module.exports = router;
