const Sequelize = require('sequelize');
const sequelize = require('../db');

const Model = Sequelize.Model;
class Meta extends Model {}
Meta.init({
    namespace: {
        type: Sequelize.STRING,
        allowNull: false
    },
    buildstate : {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
  sequelize,
  modelName: 'Meta'
});


module.exports = Meta;