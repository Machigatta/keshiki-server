require('dotenv').config()
const sequelize = new Sequelize("", process.env.DB_USER, process.env.DB_PASS, {
    dialect: "mysql"
    });

sequelize.query(`CREATE DATABASE ${process.env.DB_DATABASE}`).then(data => {
    
});