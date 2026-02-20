const { Sequelize } = require('sequelize');
require('dotenv').config();

// Default to user provided credentials if env vars not set
const sequelize = new Sequelize(
    process.env.DB_NAME || 'algonote',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'Nikuku@30',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false, // Set to console.log to see SQL queries
    }
);

module.exports = sequelize;
