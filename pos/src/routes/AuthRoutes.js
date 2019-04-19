/* jslint node es6 */

const express = require('express');
const bodyParser = require('body-parser');
const validator = require('./middleware/ValidationMiddleware');
const { check, validationResult } = require('express-validator/check');
const accountManager = require('../db/AccountManager');

const router = express.Router();
router.get('/', (req, res) => {
	accountManager.register({'username':'andrei', 'password':'testPassword1', 'sourceIp':'192.168.1.100', 'firstName':'Andrei', 'lastName':'Chirita', 'email':'andrei@macrobyte.ro'});
	res.send("success");
});

router.post('/register', validator.validatorUserRegister(), (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.mapped() });
	}
	accountManager.register(req.body).then(result => {
		res.status(200).json();
	}).catch(e => {
		res.status(400).json({'error': e});
	})
});

router.post('/login', (req, res) => {
	res.send('login');
});

router.post('/refresh', (req, res) => {
    res.send('refresh');
});


module.exports = router;
