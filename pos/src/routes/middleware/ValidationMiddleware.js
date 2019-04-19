const check = require("express-validator/check").check;
const accountManager = require("../../db/AccountManager");
function validatorUserRegister() {
  return [
    check("email")
      .trim()
      .isEmail()
      .withMessage("Invalid email address")
      .custom(value => {
        value = value.trim();
        return accountManager
          .getAccountByEmail(value)
          .then(users => {
            if (users.length > 0) {
              return false;
            } else {
              return true;
            }
          })
          .catch(e => {
            return false;
          });
      })
      .withMessage("Email already registered"),
    check("password")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Password to short. Minimum length is 4")
      .matches(/\d/)
      .withMessage("Password must contains at least one number"),
    check("firstName").trim().exists().not().isEmpty().withMessage("First name is mandatory"),
    check("lastName").trim().exists().not().isEmpty().withMessage("Last name is mandatory")
  ];
}

function validatorUserAuth() {
  return [
    check("email")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .custom(value => {
      value = value.trim();
      return accountManager
      .getAccountByEmail(value)
      .then(users => {
        if (users.length > 0) {
          return true;
        } else {
          return false;
        }
      })
      .catch( e=> {
        return false;
      });
    })
    .withMessage("Email not registered"),
    check("password")
    .trim()
    .isLength({min: 4})
    .withMessage("Invalid password")
  ]
}

module.exports = { validatorUserRegister, validatorUserAuth };
