const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();


const sequelize = new Sequelize(process.env.DB_NAME || 'auth_db', process.env.DB_USER || 'root', process.env.DB_PASSWORD || 'rootpassword', {
host: process.env.DB_HOST || 'localhost',
port: process.env.DB_PORT || 3306,
dialect: 'mysql',
logging: false,
});


module.exports = sequelize;