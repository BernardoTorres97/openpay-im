require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'mssql',
  logging: false,
  dialectOptions: {
    instanceName: 'MSSQLSERVER01',
    trustedConnection: true,
  },
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
})

const gbplus = new Sequelize({
  dialect: 'mssql',
  logging: false,
  dialectOptions: {
    instanceName: 'MSSQLSERVER01',
    trustedConnection: true,
  },
  host: process.env.DB_HOST,
  database: process.env.DB_NAME_GBPLUS,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
})

module.exports = {
  sequelize,
  gbplus,
}
