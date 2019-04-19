const { Pool } = require("pg");
const appInfo = require("../utils/AppInfo");
let crypto;
try {
  crypto = require("crypto");
} catch (err) {
  console.log("crypto support is disabled!");
}
const config = {
  appInfo: appInfo
};
const libs = require("libs")(config);
const logger = libs.logger;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  database: "falcontext"
});

class AccountManager {
  constructor() {
    pool
      .connect()
      .then(res => {
        logger.info("Database connected");
      })
      .catch(e => {
        logger.error("Error connection db");
        console.log(e.stack);
      });
  }

  register(account) {
    const ctx = this;
    return new Promise(function(resolve, rejected) {
      ctx
        .saveAccount(account)
        .then(id => {
          ctx
            .saveProfile(id, account)
            .then(res => {
              ctx.audit(id, account, "REGISTER", true).catch(e => {});
              resolve();
            })
            .catch(e => {
              ctx.audit(id, account, "REGISTER", false).catch(e => {});
              ctx.rollbackRegister(id);
              rejected(e);
            });
        })
        .catch(e => {
          rejected(e);
        });
    });
  }

  auth(account) {
    const ctx = this;
    return new Promise(function(resolve, rejected) {
      ctx
        .checkUserPass(account)
        .then(result => {
          ctx.getAccountIdByEmail(account.email).then(res => {
            if (res.length > 0) {
              ctx.audit(res[0].id, account, "AUTH", true).catch(e => {});
            } else {
              ctx.audit(0, account, "AUTH", true).catch(e => {});
            }
          });
          resolve();
        })
        .catch(e => {
          ctx.getAccountIdByEmail(account.email).then(res => {
            if (res.length > 0) {
              ctx.audit(res[0].id, account, "AUTH", false).catch(e => {});
            } else {
              ctx.audit(0, account, "AUTH", false).catch(e => {});
            }
          }); 
          console.log(e);
          rejected(e);
        });
    });
  }

  saveAccount(account) {
    const hashPassword = this.hashPassword;
    return new Promise(function(resolve, rejected) {
      const query =
        'INSERT INTO "users"."account"(email, password, created_at, last_modified) ' +
        "VALUES($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id";
      const hash = hashPassword(account.password);
      const vals = [account.email, hash];
      pool
        .connect()
        .then(client => {
          client
            .query(query, vals)
            .then(res => {
              logger.info("Register user with id " + res.rows[0].id);
              client.release();
              resolve(res.rows[0].id);
            })
            .catch(e => {
              logger.error("Error register new user");
              console.log(e.stack);
              client.release();
              rejected(e);
            });
        })
        .catch(e => {
          logger.error("Error pooling client");
          console.log(e.stack);
          rejected(e);
        });
    });
  }

  saveProfile(id, account) {
    return new Promise(function(resolve, rejected) {
      const query =
        'INSERT INTO "users"."profile"(account_id, first_name, last_name, created_at, last_modified) ' +
        "VALUES($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
      const vals = [id, account.firstName, account.lastName];
      pool
        .connect()
        .then(client => {
          client
            .query(query, vals)
            .then(res => {
              logger.info("Save profile for user " + id);
              client.release();
              resolve();
            })
            .catch(e => {
              logger.error("Error saving profile");
              console.log(e.stack);
              client.release();
              rejected(e);
            });
        })
        .catch(e => {
          logger.error("Error pooling client");
          console.log(e.stack);
          rejected(e);
        });
    });
  }

  audit(id, account, action, success) {
    return new Promise(function(resolve, rejected) {
      var status = action;
      if (success == true) {
        status = action + "_SUCCESS";
      } else {
        status = action + "_FAILED";
      }
      const query =
        'INSERT INTO "users"."audit"(account_id, action, source_ip, created_at, last_modified) ' +
        "VALUES($1, $3, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)";
      const vals = [id, account.sourceIp, status];
      pool
        .connect()
        .then(client => {
          client
            .query(query, vals)
            .then(res => {
              logger.info("Audit register action");
              client.release();
              resolve();
            })
            .catch(e => {
              logger.error("Error auditing register action");
              console.log(e.stack);
              client.release();
              rejected(e);
            });
        })
        .catch(e => {
          loggler.error("Error pooling client");
          console.log(e.stack);
          rejected(e);
        });
    });
  }

  rollbackRegister(id) {
    return new Promise(function(resolve, rejected) {
      const query = 'DELETE FROM "users"."account" WHERE id = $1';
      const vals = [id];

      pool
        .connect()
        .then(client => {
          client
            .query(query, vals)
            .then(res => {
              logger.info(
                "Rollback on register failed -> deleted account with id " + id
              );
              client.release();
              resolve();
            })
            .catch(e => {
              logger.error("Error rollback on fail register");
              console.log(e.stack);
              client.release();
              rejected(e);
            });
        })
        .catch(e => {
          loggler.error("Error pooling client");
          console.log(e.stack);
          rejected(e);
        });
    });
  }

  getAccountIdByEmail(email) {
    return new Promise(function(resolve, rejected) {
      const query = 'SELECT id FROM "users"."account" WHERE email = $1';
      const vals = [email];

      pool
        .connect()
        .then(client => {
          client
            .query(query, vals)
            .then(res => {
              logger.info("Query account by email");
              client.release();
              resolve(res.rows);
            })
            .catch(e => {
              logger.error("Error getting account by email");
              console.log(e.stack);
              client.release();
              rejected(e);
            });
        })
        .catch(e => {
          logger.error("Error pooling client");
          console.log(e.stack);
          rejected(e);
        });
    });
  }

  getAccountByEmail(email) {
    return new Promise(function(resolve, rejected) {
      const query = 'SELECT email FROM "users"."account" WHERE email = $1';
      const vals = [email];

      pool
        .connect()
        .then(client => {
          client
            .query(query, vals)
            .then(res => {
              logger.info("Query account by email");
              client.release();
              resolve(res.rows);
            })
            .catch(e => {
              logger.error("Error getting account by email");
              console.log(e.stack);
              client.release();
              rejected(e);
            });
        })
        .catch(e => {
          logger.error("Error pooling client");
          console.log(e.stack);
          rejected(e);
        });
    });
  }

  checkUserPass(account) {
    let ctx = this;
    return new Promise(function(resolve, rejected) {
      const email = account.email;
      const password = ctx.hashPassword(account.password);
      const query =
        'SELECT email, password FROM "users"."account" where email = $1 and password = $2';
      const vals = [email, password];
      pool
        .connect()
        .then(client => {
          client
            .query(query, vals)
            .then(res => {
              logger.info("Query account by email / password");
              client.release();
              if (res.rows.length > 0) {
                resolve();
              } else {
                rejected("email or password incorrect");
              }
            })
            .catch(e => {
              logger.error("Error getting account by email / password");
              console.log(e.stack);
              client.release();
              rejected(e);
            });
        })
        .catch(e => {
          logger.error("Error pooling client");
          console.log(e.stack);
          rejected(e);
        });
    });
  }

  hashPassword(password) {
    const secret = "txetnoclaf";
    const hash = crypto
      .createHmac("sha256", secret)
      .update(password)
      .digest("hex");
    return hash;
  }
}

module.exports = new AccountManager();
