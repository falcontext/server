const check = require('express-validator/check').check;

function validatorUserRegister() {
	return [
		check('username').matches(/^[0-9a-zA-Z]{4..}$/).withMessage('Invalid username'),
		check('firstName').matches(/^[a-zA-Z]$/).withMessage('Invalid firstName'),
		check('lastName').matches(/^[a-zA-Z]$/).withMessage('Invalid lastName'),
		check('password').matches(/^{6..}$/).withMessage('Password to short. Minimum 6 characters'),
		check('email').matches()
	];
}

function checkRegisterValidationResult(req, res, next) {
	const result = validatorUserRegister(req);
	if (result.length === 0) {
		return next();
	}
	res.status(400).json({errors: result});
	return '';
}

function checkValidationResult(req, res, next) {
	const result = validatorUserRegister(req);
	if (result.length === 0) {
		return next();
	}
	res.status(400).json({ errors: result});
	return '';
}

module.exports = { validatorUserRegister, checkValidationResult };
