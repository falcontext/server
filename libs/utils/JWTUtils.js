const jwt = require("jsonwebtoken");
class JWTUtils {
  constructor() {
  }

  generateRefreshToken(email) {
    let token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
      expiresIn: "150d"
    });
    return token;
  }

  generateAccessToken(rt) {
    let email = rt.email;
    let token = jwt.sign({ email: email }, process.env.JWT_SECRET, {
      expiresIn: "30s"
    });
    return token;
  }

  decodeToken(token) {
    return new Promise(function(resolve, rejected) {
      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
      }
      if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            rejected(err.name);
          } else {
            resolve(decoded);
          }
        });
      } else {
        rejected("Missing token");
      }
    });
  }
}

module.exports = new JWTUtils();
