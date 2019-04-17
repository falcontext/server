const { Pool } = require('pg');
const appInfo = require('../utils/AppInfo');
let crypto;
try {
    crypto = require('crypto');
  } catch (err) {
    console.log('crypto support is disabled!');
  }
const config = {
    appInfo: appInfo
}
const libs = require('libs')(config);
const logger = libs.logger;

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    database: 'falcontext'
  });

class AccountManager {     
    constructor () {
        pool.connect().then( res => {
            logger.info('Database connected');
        }).catch(e => {
            logger.error('Error connection db');
            console.log(e.stack);
        })
    }

    register(account) {
        const ctx = this;
        return new Promise(function(resolve, rejected) {
            ctx.saveAccount(account).then(id => {
                ctx.saveProfile(id, account).then(res => {
                    ctx.auditRegister(id, account, true).catch(e => {

                    });
                    resolve();
                }).catch(e => {
                    ctx.auditRegister(id, account, false).catch(e => {
                        
                    });
                    ctx.rollbackRegister(id);
                    rejected(e);
                });
            }).catch(e => {
                rejected(e);
            })
        })
    }

    saveAccount(account) {
        const hashPassword = this.hashPassword;
        return new Promise(function(resolve, rejected) {
            const query = 'INSERT INTO "users"."account"(username, password, created_at, last_modified) ' 
            + 'VALUES($1, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id';
            const hash = hashPassword(account.password);
            const vals = [account.username, hash];
            pool.connect().then(client => {
                client.query(query, vals).then(res => {
                    logger.info('Register user with id ' + res.rows[0].id);
                    client.release();
                    resolve(res.rows[0].id);
                }).catch(e => {
                    logger.error('Error register new user');
                    console.log(e.stack);
                    client.release();
                    rejected(e);
                })
            }).catch(e => {
                logger.error('Error pooling client');
                console.log(e.stack);
                rejected(e);
            })
        })
    }

    saveProfile(id, account) {
        return new Promise(function(resolve, rejected) {
            const query = 'INSERT INTO "users"."profile"(account_id, first_name, last_name, email, created_at, last_modified) '
            + 'VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';
            const vals = [id, account.firstName, account.lastName, account.email];
            pool.connect().then(client => {
                client.query(query, vals).then(res => {
                    logger.info('Save profile for user ' + id);
                    client.release();
                    resolve();
                }).catch(e => {
                    logger.error('Error saving profile');
                    console.log(e.stack);
                    client.release();
                    rejected(e);
                })
            }).catch(e => {
                logger.error('Error pooling client');
                console.log(e.stack);
                rejected(e);
            })
        })
    }

    auditRegister(id, account, success) {
        return new Promise(function(resolve, rejected) {
            const status = "REGISTER";
            if (success) {
                status = "REGISTER_SUCCESS";
            } else {
                status = "REGISTER_FAILED";
            }
            const query = 'INSERT INTO "users"."audit"(account_id, action, source_ip, created_at, last_modified) '
            + 'VALUES($1, $3, $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';
            const vals = [id, account.sourceIp, status];
            pool.connect().then(client => {
                client.query(query, vals).then(res => {
                    logger.info('Audit register action');
                    client.release();
                    resolve();
                }).catch(e => {
                    logger.error('Error auditing register action')
                    console.log(e.stack);
                    client.release();
                    rejected(e);
                })
            }).catch(e => {
                loggler.error('Error pooling client');
                console.log(e.stack);
                rejected(e);
            });
        });
    }

    rollbackRegister(id) {
        return new Promise(function(resolve, rejected) {
            const query = 'DELETE FROM "users"."account" WHERE id = $1';
            const vals = [id];

            pool.connect().then(client => {
                client.query(query, vals).then(res => {
                    logger.info('Rollback on register failed -> deleted account with id ' + id);
                    client.release();
                    resolve()
                }).catch(e => {
                    logger.error('Error rollback on fail register')
                    console.log(e.stack);
                    client.release();
                    rejected(e);
                });
            }).catch(e => {
                loggler.error('Error pooling client');
                console.log(e.stack);
                rejected(e);
            });
        });
    }

    hashPassword(password) {
        const secret = 'txetnoclaf'
        const hash = crypto.createHmac('sha256', secret)
                   .update(password)
                   .digest('hex')
        return hash;
    }
}

module.exports = new AccountManager();