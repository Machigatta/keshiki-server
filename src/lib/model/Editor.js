const Sequelize = require('sequelize');
const bcryptService = require('../brcypt');

const sequelize = require('../db');

const Editor = sequelize.define('Editor', {
    role: Sequelize.STRING
  });


  module.exports = Editor