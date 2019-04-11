const check = require('express-validator/check').check;

function validatorUserRegister() {
	return [
		check('user').matches(/^[0-9a-zA-Z]{24}$/).withMessage('Invalid username'),
		check('firstName').matches(/^[a-zA-Z]$/).withMessage('Invalid firstName'),
		check('lastName').matches(/^[a-zA-Z]$/).withMessage('Invalid lastName'),
	];
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
