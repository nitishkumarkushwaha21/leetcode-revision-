const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'algonote',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'Nikuku@30',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false,
    }
);

module.exports = sequelize;
