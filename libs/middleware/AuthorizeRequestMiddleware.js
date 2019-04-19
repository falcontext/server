let jwtUtils = require("../utils/JWTUtils");

let checkToken = (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
  jwtUtils
    .decodeToken(token)
    .then(decodedToken => {
        req.body.decodedToken = decodedToken
      next();
    })
    .catch(e => {
      res.status(401).json({ error: e });
    });
};

module.exports = {
  checkToken: checkToken
};
