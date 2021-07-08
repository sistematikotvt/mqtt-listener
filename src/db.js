const sql = require('mssql');
const configs = require('./config/config.js');
let config = global.gConfig;

const sqlConfig = {
  user: config.db_userName,
  password: config.db_password,
  database: config.db_name,
  server: config.db_server,
  port: config.db_port,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
}

const poolPromise = new sql.ConnectionPool(sqlConfig)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL...')
    return pool
  })
  .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {
  sql, poolPromise
}
