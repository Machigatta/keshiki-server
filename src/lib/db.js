const Sequelize = require('sequelize');
require('dotenv').config()

let connectionObj = {};
if (process.env.DB_DIALECT == 'postgres') {
  connectionObj = process.env.DATABASE_URL;
}else{
  connectionObj = {
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000,
    },
  }
}
let  database = new Sequelize(connectionObj)
module.exports = database