const Sequelize = require('sequelize');
require('dotenv').config()

let  database = new Sequelize({
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
  },
)

//database.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}`);

module.exports = database