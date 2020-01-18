const Sequelize = require('sequelize');
const bcryptService = require('../brcypt');

const sequelize = require('../db');
const tableName = 'screen';

const Screen = sequelize.define('Screen', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    protection: {
        type: Sequelize.STRING,
        allowNull: true,
    }
}, { tableName });

// eslint-disable-next-line
Screen.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  delete values.password;

  return values;
};

module.exports = Screen;