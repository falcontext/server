/* jslint node es6 */

const express = require("express");
const bodyParser = require("body-parser");
const validator = require("./middleware/ValidationMiddleware");
const { check, validationResult } = require("express-validator/check");
const accountManager = require("../db/AccountManager");
const appInfo = require("../utils/AppInfo");
const config = {
  appInfo: appInfo
};
const libs = require("libs")(config);
const jwtUtils = libs.jwtUtils;
const authorizeRequestMiddleware = libs.authorizeRequestMiddleware;

const router = express.Router();
router.post("/", (req, res) => {});

router.post("/register", validator.validatorUserRegister(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }
  accountManager
    .register(req.body)
    .then(result => {
      let rt = jwtUtils.generateRefreshToken(req.body.email);
      jwtUtils
        .decodeToken(rt)
        .then(decodedRt => {
          let at = jwtUtils.generateAccessToken(decodedRt);
          if (at && rt) {
            res.status(200).json({ accessToken: at, refreshToken: rt });
          } else {
            res
              .status(500)
              .json({ error: "Unexpected error generating access tokens" });
          }
        })
        .catch(e => {
          console.log(e);
          res.status(500).json({ error: e.name });
        });
    })
    .catch(e => {
      console.log(e);
      res.status(400).json({ error: e });
    });
});

router.post("/login", validator.validatorUserAuth(), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }
  accountManager
    .auth(req.body)
    .then(result => {
      let rt = jwtUtils.generateRefreshToken(req.body.email);
      jwtUtils
        .decodeToken(rt)
        .then(decodedRt => {
          let at = jwtUtils.generateAccessToken(decodedRt);
          if (at && rt) {
            res.status(200).json({ accessToken: at, refreshToken: rt });
          } else {
            res
              .status(500)
              .json({ error: "Unexpected error generating access tokens" });
          }
        })
        .catch(e => {
          console.log(e);
          res.status(500).json({ error: e.name });
	    });
	// res.status(200).json();
    })
    .catch(e => {
      res.status(400).json({ error: e });
    });
});

router.get("/refresh", authorizeRequestMiddleware.checkToken, (req, res) => {
  let at = jwtUtils.generateAccessToken(req.body.decodedToken);
  if (at) {
    res.status(200).json({ accessToken: at });
  } else {
    res.status(500).json({ error: "Unexpected error refreshing access token" });
  }
});

module.exports = router;
